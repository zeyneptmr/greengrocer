// --- CONTROLLER: OrderController.java ---
package org.example.greengrocer.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.Address;
import org.example.greengrocer.model.CartItem;
import org.example.greengrocer.model.CustomerOrder;
import org.example.greengrocer.model.OrderProduct;
import org.example.greengrocer.model.OrderStatus;
import org.example.greengrocer.model.OrderTotal;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.AddressRepository;
import org.example.greengrocer.repository.CartItemRepository;
import org.example.greengrocer.repository.CustomerOrderRepository;
import org.example.greengrocer.repository.OrderProductRepository;
import org.example.greengrocer.repository.OrderStatusRepository;
import org.example.greengrocer.repository.OrderTotalRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.example.greengrocer.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/customerorder")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerOrderController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CustomerOrderRepository orderRepository;

    @Autowired
    private OrderProductRepository orderProductRepo;

    @Autowired
    private CartItemRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private OrderTotalRepository orderTotalRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    private String getUserEmailFromToken(HttpServletRequest request) {
        return Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .map(Cookie::getValue)
                .filter(token -> tokenProvider.validateToken(token))
                .map(tokenProvider::getEmailFromToken)
                .findFirst().orElse(null);
    }

    @GetMapping("/my")
    public List<CustomerOrder> getMyOrders(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        return orderRepository.findByUserEmail(email);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        User user = userOpt.get();

        String address = addressRepository.findByUserAndIsDefaultTrue(user).map(Address::getFullAddress).orElse("No default address");

        OrderTotal orderTotal = orderTotalRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Order total not found"));


        CustomerOrder order = new CustomerOrder();
        order.setUser(user);
        order.setUserEmail(email);
        order.setShippingAddress(address);
        order.setProductTotal(orderTotal.getTotalPrice());
        order.setShippingFee(orderTotal.getShippingFee());
        order.setTotalAmount(orderTotal.getTotalAmount());
        orderRepository.save(order);

        // Siparişin ilk durumunu ekle: "Sipariş Alındı"
        OrderStatus initialStatus = new OrderStatus("Sipariş Alındı", order);
        orderStatusRepository.save(initialStatus);
        // (İsteğe bağlı) Order nesnesinin statusHistory listesine de ekle
        order.getStatusHistory().add(initialStatus);

        orderRepository.save(order);  // Siparişin statusHistory güncellendikten sonra tekrar kaydet

        List<CartItem> cartItems = cartRepository.findByUser(user);
        for (CartItem item : cartItems) {
            OrderProduct op = new OrderProduct();
            op.setCustomerOrder(order);
            op.setProductId(item.getProductId());
            op.setProductName(item.getName());
            op.setQuantity(item.getQuantity());
            op.setPricePerProduct(item.getPrice());
            op.setTotalPerProduct(item.getQuantity() * item.getPrice());
            orderProductRepo.save(op);
        }

        return ResponseEntity.ok("Order created with ID: " + order.getOrderId());
    }


    @PostMapping("/finalize")
    public ResponseEntity<?> finalizeOrder(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        User user = userOpt.get();

        // Siparişleri bul
        List<CustomerOrder> userOrders = orderRepository.findByUser(user);
        if (userOrders.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found");

        // En son siparişi al
        CustomerOrder lastOrder = userOrders.get(userOrders.size() - 1);

        // Sipariş ürünlerini getir
        List<OrderProduct> orderProducts = orderProductRepo.findByCustomerOrder(lastOrder);

        /* Her ürünün stok bilgisini güncelle
        //for (OrderProduct op : orderProducts) {
         //   System.out.println("OrderProduct ID: " + op.getProductId());
         //   Optional<Product> productOpt = productService.getProductById(op.getProductId());
         //   productOpt.ifPresent(product -> {
                int newStock = product.getStock() - op.getQuantity();
                product.setStock(Math.max(newStock, 0));  // stok eksiye düşmesin diye
                productService.updateProduct(product);
                System.out.println("Updating stock for productId: " + op.getProductId());
            });
        }*/

        // Cart sil
        List<CartItem> cartItems = cartRepository.findByUser(user);
        cartRepository.deleteAll(cartItems);

        // OrderTotal sil
        // OrderTotal sil
        Optional<OrderTotal> orderTotalOptional = orderTotalRepository.findByUser(user);
        orderTotalOptional.ifPresent(orderTotalRepository::delete);  // OrderTotal item'ını sil


        return ResponseEntity.ok("Payment handled, cart cleared, stock updated for user" + email);
    }


    @GetMapping("/total-sales")
    public ResponseEntity<Double> getTotalSales() {
        Double totalSales = orderRepository.calculateTotalSales();
        // Handle null case (when there are no orders)
        if (totalSales == null) {
            totalSales = 0.0;
        }

        return ResponseEntity.ok(totalSales);
        
    }





}

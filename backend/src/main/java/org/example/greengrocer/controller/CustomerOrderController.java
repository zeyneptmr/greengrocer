package org.example.greengrocer.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.greengrocer.model.Address;
import org.example.greengrocer.model.CartItem;
import org.example.greengrocer.model.CustomerOrder;
import org.example.greengrocer.model.OrderProduct;
import org.example.greengrocer.model.OrderStatus;
import org.example.greengrocer.model.OrderTotal;
import org.example.greengrocer.model.Product;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/orders/all")
    public ResponseEntity<?> getAllOrders(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        User user = userOpt.get();

        List<CustomerOrder> orders = orderRepository.findAll();

        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No orders available");
        }

        List<Map<String, Object>> simplifiedOrders = orders.stream().map(order -> {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("orderId", order.getOrderId());
            orderMap.put("createdAt", order.getCreatedAt());
            orderMap.put("userId", order.getUser().getId());
            orderMap.put("userEmail", order.getUserEmail());
            orderMap.put("productTotal", order.getProductTotal());
            orderMap.put("shippingAddress", order.getShippingAddress());
            orderMap.put("shippingFee", order.getShippingFee());
            orderMap.put("totalAmount", order.getTotalAmount());
            orderMap.put("latestStatus", order.getLatestStatus());

            orderMap.put("statusHistory", order.getStatusHistory().stream().map(status -> {
                Map<String, Object> statusMap = new HashMap<>();
                statusMap.put("status", status.getStatus());
                statusMap.put("timestamp", status.getTimestamp());
                return statusMap;
            }).collect(Collectors.toList()));

            return orderMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(simplifiedOrders);
    }

    private String getUserEmailFromToken(HttpServletRequest request) {
        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null || !tokenProvider.validateToken(token)) {
            return null;
        }

        return tokenProvider.getEmailFromToken(token);
    }


    @PostMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestBody Map<String, String> body, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Optional<CustomerOrder> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }

        CustomerOrder order = orderOpt.get();
        String newStatus = body.get("status");

        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        OrderStatus status = new OrderStatus();
        status.setStatus(newStatus);
        status.setTimestamp(LocalDateTime.now());
        status.setCustomerOrder(order);

        orderStatusRepository.save(status);

        order.setLatestStatus(newStatus);
        orderRepository.save(order);
        System.out.println("Saved order with ID: " + order.getOrderId());

        return ResponseEntity.ok("Status updated successfully");
    }

    @GetMapping("/orders/my")
    public ResponseEntity<?> getMyOrders(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        User user = userOpt.get();

        List<CustomerOrder> orders = orderRepository.findByUser(user);

        if (orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No orders found for user");
        }

        List<Map<String, Object>> simplifiedOrders = orders.stream().map(order -> {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("orderId", order.getOrderId());
            orderMap.put("createdAt", order.getCreatedAt());
            orderMap.put("productTotal", order.getProductTotal());
            orderMap.put("shippingAddress", order.getShippingAddress());
            orderMap.put("shippingFee", order.getShippingFee());
            orderMap.put("totalAmount", order.getTotalAmount());
            orderMap.put("latestStatus", order.getLatestStatus());

            orderMap.put("statusHistory", order.getStatusHistory().stream().map(status -> {
                Map<String, Object> statusMap = new HashMap<>();
                statusMap.put("status", status.getStatus());
                statusMap.put("timestamp", status.getTimestamp());
                return statusMap;
            }).collect(Collectors.toList()));

            return orderMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(simplifiedOrders);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getMyOrderById(@PathVariable String orderId, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        User user = userOpt.get();

        Optional<CustomerOrder> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");

        CustomerOrder order = orderOpt.get();

        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This order does not belong to you");
        }

        Map<String, Object> orderMap = new HashMap<>();
        orderMap.put("orderId", order.getOrderId());
        orderMap.put("createdAt", order.getCreatedAt());
        orderMap.put("productTotal", order.getProductTotal());
        orderMap.put("shippingAddress", order.getShippingAddress());
        orderMap.put("shippingFee", order.getShippingFee());
        orderMap.put("totalAmount", order.getTotalAmount());
        orderMap.put("latestStatus", order.getLatestStatus());

        orderMap.put("statusHistory", order.getStatusHistory().stream().map(status -> {
            Map<String, Object> statusMap = new HashMap<>();
            statusMap.put("status", status.getStatus());
            statusMap.put("timestamp", status.getTimestamp());
            return statusMap;
        }).collect(Collectors.toList()));

        return ResponseEntity.ok(orderMap);
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
        order.setLatestStatus("Order Received");
        order.setUser(user);
        order.setUserEmail(email);
        order.setShippingAddress(address);
        order.setProductTotal(orderTotal.getTotalPrice());
        order.setShippingFee(orderTotal.getShippingFee());
        order.setTotalAmount(orderTotal.getTotalAmount());

        OrderStatus initialStatus = new OrderStatus("Order Received", order);

        order.getStatusHistory().add(initialStatus);
        orderRepository.save(order);
        System.out.println("Saved order with ID: " + order.getOrderId());

        List<CartItem> cartItems = cartRepository.findByUser(user);

        for (CartItem item : cartItems) {
            OrderProduct op = new OrderProduct();
            op.setCustomerOrder(order);
            System.out.println("Setting CustomerOrder: " + order.getOrderId());
            op.setProductId(item.getProductId());
            op.setProductName(item.getName());
            op.setQuantity(item.getQuantity());
            op.setImagePath(item.getImagePath());
            op.setPricePerProduct(item.getPrice());
            op.setTotalPerProduct(item.getQuantity() * item.getPrice());

            System.out.println("Saving OrderProduct with OrderId: " + order.getOrderId());
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

        List<CustomerOrder> userOrders = orderRepository.findByUser(user);
        if (userOrders.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No orders found");

        List<CartItem> cartItems = cartRepository.findByUser(user);
        cartRepository.deleteAll(cartItems);

        Optional<OrderTotal> orderTotalOptional = orderTotalRepository.findByUser(user);
        orderTotalOptional.ifPresent(orderTotalRepository::delete);

        return ResponseEntity.ok("Payment handled, cart cleared, stock updated for user" + email);
    }

    @GetMapping("/total-sales")
    public ResponseEntity<Double> getTotalSales() {
        Double totalSales = orderRepository.calculateTotalSales();
        if (totalSales == null) {
            totalSales = 0.0;
        }

        return ResponseEntity.ok(totalSales);

    }

@GetMapping("/orders-by-date")
public ResponseEntity<Map<String, Integer>> getOrdersByDate(@RequestParam(required = false) Integer year, @RequestParam(required = false) Integer month) {
    
    if (year == null) year = LocalDate.now().getYear();
    if (month == null) month = LocalDate.now().getMonthValue();
    

    LocalDate startDate = LocalDate.of(year, month, 1);
    LocalDate endDate = startDate.plusMonths(1).minusDays(1);
    

    List<CustomerOrder> orders = orderRepository.findByCreatedAtBetween(
        startDate.atStartOfDay(), 
        endDate.atTime(23, 59, 59)
    );
    
    Map<String, Integer> ordersByDate = new HashMap<>();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    

    for (int day = 1; day <= endDate.getDayOfMonth(); day++) {
        LocalDate date = LocalDate.of(year, month, day);
        ordersByDate.put(date.format(formatter), 0);
    }

    for (CustomerOrder order : orders) {
        String dateStr = order.getCreatedAt().toLocalDate().format(formatter);
        ordersByDate.put(dateStr, ordersByDate.getOrDefault(dateStr, 0) + 1);
    }
    
    return ResponseEntity.ok(ordersByDate);
}


@GetMapping("/monthly-sales")
public ResponseEntity<Map<String, Double>> getMonthlySales(@RequestParam(required = false) Integer year) {

    if (year == null) {
        year = LocalDate.now().getYear();
    }
    
    Map<String, Double> monthlySales = new HashMap<>();
    

    for (int month = 1; month <= 12; month++) {
        String monthName = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        monthlySales.put(monthName, 0.0);
    }
    

    LocalDate startDate = LocalDate.of(year, 1, 1);
    LocalDate endDate = LocalDate.of(year, 12, 31);
    
    List<CustomerOrder> orders = orderRepository.findByCreatedAtBetween(
        startDate.atStartOfDay(), 
        endDate.atTime(23, 59, 59)
    );
    
    
    for (CustomerOrder order : orders) {
        LocalDate orderDate = order.getCreatedAt().toLocalDate();
        String monthName = orderDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        double existingTotal = monthlySales.getOrDefault(monthName, 0.0);
        monthlySales.put(monthName, existingTotal + order.getTotalAmount());
    }
    
    return ResponseEntity.ok(monthlySales);
}

}
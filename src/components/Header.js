import React from 'react';

const Header = () => {
    return (
        <header style={{ padding: '20px', backgroundColor: '#4CAF50', color: 'white', textAlign: 'center' }}>
            <h1>GreenGrocer</h1>
            <nav>
                <a href="#" style={{ margin: '0 10px', color: 'white' }}>Ana Sayfa</a>
                <a href="#" style={{ margin: '0 10px', color: 'white' }}>Ürünler</a>
                <a href="#" style={{ margin: '0 10px', color: 'white' }}>Sepet</a>
                <a href="#" style={{ margin: '0 10px', color: 'white' }}>İletişim</a>
            </nav>
        </header>
    );
};

export default Header;

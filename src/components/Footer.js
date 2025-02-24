import React from 'react';
import '../styles/Footer.css'
import VegetableIcon from '../assets/vegetables.svg';
import LocationIcon from '../assets/location.svg';
import PhoneIcon from '../assets/phone.svg';
import MailIcon from '../assets/mail.svg';
import MegaphoneIcon from '../assets/megaphone.svg';
import FacebookIcon from '../assets/facebook.svg';
import InstagramIcon from '../assets/instagram.svg';
import YoutubeIcon from '../assets/youtube.svg';


function Footer() {
  return (
    <div className='main-footer'>
        <div className='container'>
        
            <div className='row'>
                
                <div className='column'>
                    <h4>CONTACT</h4>
                    <br></br>
                    
                    <div className='locationcontainer'>
                        <img src={LocationIcon} alt="LocationIcon" className="footericons" />
                        <p>Cibali Mah. Kadir Has Cad. 34083
                        Fatih-İstanbul</p>
                    </div>

                    <br></br>

                    <div className='phonecontainer'>
                        <img src={PhoneIcon} alt="PhoneIcon" className="footericons" />
                        <p>(0212) 533 65 32</p>
                    </div>
                    
                    <br></br>

                    <div className='mailcontainer'>
                        <img src={MailIcon} alt="MailIcon" className="footericons" />
                        <p>taptaze@stu.khas.edu.tr</p>
                        
                    </div>    
                       

                </div>

                <div className='vegetablecolumn'>
                    <img src={VegetableIcon} alt="VegetableIcon" className="vegetableicon" />
                </div>
            
                <div className='column'>
                    <h4>COMPANY</h4>
                    <br></br>
                    
                    <div className='aboutcontainer'>
                    <img src={MegaphoneIcon} alt="MegaphoneIcon" className="footericons" />
                        <a href='/'>About Us</a>
                        
                    </div> 

                    <div className='socialmediacontainer'>
                        <a href='https://www.facebook.com/' target='_blank' rel='noopener noreferrer'>
                            <img src={FacebookIcon} alt="FacebookIcon" className="socialmediaicons" />
                        </a>

                        <a href='https://www.instagram.com/' target='_blank' rel='noopener noreferrer'>
                        <img src={InstagramIcon} alt="InstagramIcon" className="socialmediaicons" />
                        </a>

                        <a href='https://www.youtube.com/' target='_blank' rel='noopener noreferrer'>
                        <img src={YoutubeIcon} alt="YoutubeIcon" className="socialmediaicons" />
                        </a>

                    
                    </div> 


                </div>

            </div>
            <hr></hr>
            <div className='row'>
                <p className='copyright'>
                    &copy; {new Date().getFullYear()} All Rights Reserved

                </p>

            </div>



        </div>


        
      
  
    </div>
  );
}

export default Footer;
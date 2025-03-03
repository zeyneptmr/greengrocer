import React from 'react';
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
      <div className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">

            {/* Contact */}
            <div className="flex-1 min-w-[200px] ml-[-30px]">
              <h4 className="text-lg font-bold">CONTACT</h4>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <img src={LocationIcon} alt="Location" className="w-5 mr-2" />
                  <a
                      href="https://maps.google.com/?q=Cibali+Mah.+Kadir+Has+Cad.+34083+Fatih-İstanbul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yellow-400 transition"
                  >
                    Cibali Mah. Kadir Has Cad. 34083 Fatih-İstanbul
                  </a>
                </div>
                <div className="flex items-center">
                  <img src={PhoneIcon} alt="Phone" className="w-5 mr-2" />
                  <span>(0212) 533 65 32</span>
                </div>
                <div className="flex items-center">
                  <img src={MailIcon} alt="Mail" className="w-5 mr-2" />
                  <a href="mailto:taptaze@stu.khas.edu.tr" className="hover:text-yellow-400 transition">
                    taptaze@stu.khas.edu.tr
                  </a>
                </div>
              </div>
            </div>

            {/* Vegetable Section */}
            <div className="flex-1 flex justify-center">
              <img src={VegetableIcon} alt="Vegetable Icon" className="w-24" />
            </div>

            {/* Company Section */}
            <div className="flex-1 text-center">
              <h4 className="text-lg font-bold">COMPANY</h4>
              <div className="mt-4">
                <a
                    href="/about"
                    className="inline-flex items-center space-x-2 hover:text-yellow-400 transition"
                >
                  <img src={MegaphoneIcon} alt="Megaphone Icon" className="w-5" />
                  <span>About Us</span>
                </a>
              </div>

              <div className="mt-2">
                <a href="/contact" className="font-bold hover:text-yellow-400 transition">Contact Us</a>
              </div>

              <div className="mt-6 flex justify-center space-x-6">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
                   className="transition-transform transform hover:scale-150">
                  <img src={FacebookIcon} alt="Facebook Icon" className="w-10"/>
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
                   className="transition-transform transform hover:scale-150">
                  <img src={InstagramIcon} alt="Instagram Icon" className="w-10"/>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"
                   className="transition-transform transform hover:scale-150">
                  <img src={YoutubeIcon} alt="Youtube Icon" className="w-10"/>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom Section */}
          <hr className="border-white my-6 w-full mx-auto"/>
          <p className="text-center text-sm">&copy; {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </div>
  );
}

export default Footer;
import React from 'react';
import VegetableIcon from '../assets/vegetables.svg';
import LocationIcon from '../assets/location.svg';
import PhoneIcon from '../assets/phone.svg';
import MailIcon from '../assets/mail.svg';
import MegaphoneIcon from '../assets/megaphone.svg';
import FAQIcon from '../assets/question-circle-svgrepo-com.svg';
import FacebookIcon from '../assets/facebook.svg';
import InstagramIcon from '../assets/instagram.svg';
import YoutubeIcon from '../assets/youtube.svg';
import ContactUsIcon from '../assets/contactus.svg';
import { useTranslation } from 'react-i18next';
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";


function Footer() {

  const { language } = useContext(LanguageContext);
  const { t } = useTranslation('footer');

  return (
      <div className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">

            {/* Contact */}
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-lg font-bold text-left pl-20">{t('contact')}</h3>
              <div className="mt-4 space-y-4 flex flex-col">
                <div className="flex items-start gap-2">
                  <img src={LocationIcon} alt="Location" className="w-5 mt-1" />
                  <a
                      href="https://maps.google.com/?q=Cibali+Mah.+Kadir+Has+Cad.+34083+Fatih-İstanbul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yellow-400 transition leading-snug"
                  >
                    {t('address')}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <img src={PhoneIcon} alt="Phone" className="w-5" />
                  <span>{t('phone')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={MailIcon} alt="Mail" className="w-5" />
                  <a href="mailto:taptaze@stu.khas.edu.tr" className="hover:text-yellow-400 transition">
                    {t('email')}
                  </a>
                </div>
              </div>
            </div>

            {/* Vegetable Section with Social Media */}
            <div className="flex-1 flex flex-col items-center">
              <img src={VegetableIcon} alt="Vegetable Icon" className="w-24" />
              <div className="mt-6 flex justify-center space-x-6">
                <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform transform hover:scale-125 hover:brightness-110"
                >
                  <img src={FacebookIcon} alt="Facebook Icon" className="w-8 md:w-10" />
                </a>
                <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform transform hover:scale-125 hover:brightness-110"
                >
                  <img src={InstagramIcon} alt="Instagram Icon" className="w-8 md:w-10" />
                </a>
                <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform transform hover:scale-125 hover:brightness-110"
                >
                  <img src={YoutubeIcon} alt="Youtube Icon" className="w-8 md:w-10" />
                </a>
              </div>
            </div>

            {/* Company Section */}
            <div className="flex-1 text-center">
              <h3 className="text-lg font-bold">{t('company')}</h3>
              <div className="mt-4">
                <a
                    href="/about"
                    className="inline-flex items-center space-x-2 hover:text-yellow-400 transition"
                >
                  <img src={MegaphoneIcon} alt="Megaphone Icon" className="w-5"/>
                  <span>{t('about')}</span>
                </a>
              </div>

              <div className="mt-4">
                <a
                    href="/contact"
                    className="inline-flex items-center space-x-2 hover:text-yellow-400 transition"
                >
                  <img src={ContactUsIcon} alt="ContactUs Icon" className="w-5"/>
                  <span>{t('contactUs')}</span>
                </a>
              </div>

              <div className="mt-4">
                <a
                    href="/faq"
                    className="inline-flex items-center space-x-2 hover:text-yellow-400 transition"
                >
                  <img src={FAQIcon} alt="FAQ Icon" className="w-5"/>
                  <span>{t('faq')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom Section */}
          <hr className="border-white my-6 w-full mx-auto"/>
          <p className="text-center text-sm">&copy; {new Date().getFullYear()} {t('rights')}</p>
        </div>
      </div>
  );
}

export default Footer;


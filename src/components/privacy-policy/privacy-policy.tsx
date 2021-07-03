import React from 'react';

import { BackgroundBlur } from '@components/with-background';
import { useAnimation } from '@hooks/use-animation';
import { ReactComponent as CloseSVG } from '@icons/close-x.svg';
import { stopPropagation } from '@utils/stop-propagation';

import './privacy-policy.scss';

interface IPrivacyPolicyProps {
  close: () => void;
}

const BLOCK_NAME = 'policy-modal';

export const PrivacyPolicy: React.FC<IPrivacyPolicyProps> = ({ close }) => {
  const { rootClass, closeInitiated, animatedClose } = useAnimation(BLOCK_NAME, close);

  return (
    <BackgroundBlur hiding={closeInitiated} onClick={animatedClose}>
      <div onClick={stopPropagation} className={rootClass}>
        <div className={`${BLOCK_NAME}__header`}>
          <div className={`${BLOCK_NAME}__top-group`}>
            <h1>Privacy Policy</h1>
            <button type="button" onClick={animatedClose} className={`${BLOCK_NAME}__close`}>
              <CloseSVG />
            </button>
          </div>
          <div className={`${BLOCK_NAME}__h-line`} />
        </div>
        <div className={`${BLOCK_NAME}__text-container`}>
          <p>
            This Privacy Policy explains what information is collected by ARKONI when you visit the
            arkoni.io website (hereinafter “the website”), visit any related websites (hereinafter
            “subdomains”), use any other services provided by ARKONI, or communicate with us by any
            means including by email, phone, messenger, or any other medium. This Privacy Policy
            also explains how you can control the information we collect, how this information will
            be used, and how to contact us. This document describes how we protect your personal
            data.
          </p>
          <h2>1. Who collects data about you</h2>
          <p>
            Your data is collected by ARKONI and is not used by or shared with anyone not mentioned
            in this Privacy Policy. If you have any questions, comments, or requests related to data
            collection or this policy, please contact us at contact@arkoni.io.
          </p>
          <h2>2. What data we collect about you</h2>
          <h2>2.1 When you contact us</h2>
          <p>
            We collect data that you submit through the contact form on our website or that you
            disclose to us by other means such as orally (over a call) or in writing (in an email or
            other text messages). We collect your full name, email address, phone number, and any
            additional information you provide.
          </p>
          <h2>2.2 When you subscribe to our updates</h2>
          <p>
            When you subscribe to our updates via the blog, we collect the email address you provide
            and your subscription preferences.
          </p>
          <p />
          <h2>2.3 When you apply for a job</h2>
          <p>
            When you apply to join our team, we collect information from your CV and any additional
            information you provide us by any written or oral means.
          </p>
          <h2>
            2.4 Data that is automatically collected when you visit the website and subdomains
          </h2>
          <h2>2.4.1 Third-party services</h2>

          <p>
            Our website and subdomains use third-party services to collect standard internet log
            information and details about visitors’ behavior patterns. To collect this information,
            we use Google Analytics, Google Tag Manager, Facebook, Mailchimp, and Yandex.Metrika. We
            do this to improve your experience on our website and to provide you with the most
            relevant information.
            <br />
            We carefully investigate all third-party services that we use to make sure they are
            compliant with all current regulations.
          </p>
          <h2>2.4.2 Cookies</h2>
          <p>
            When you visit the ARKONI websites, ARKONI may place cookies and similar analytical
            codes (collectively, “Cookies”) on your device, browser or the webpage you are viewing,
            in order to personalize your experience, understand usage patterns and provide, improve,
            and secure the ARKONI websites. Cookies are simple computer files made of text. Cookies
            do not typically contain any information that personally identifies someone, but
            personal data that we store about you may be linked to the information obtained from
            cookies.
          </p>
          <h2>Our websites use different types of Cookies for different reasons, as follows:</h2>
          <ul>
            <li>
              Functional cookies – these Cookies are essential to enable you to move around the
              ARKONI websites and use their features. These Cookies make sure you can view the
              websites and use them in a proper way. They also give you access to secured parts of
              the ARKONI websites. Examples of functional cookies: SID, PHPSESSID, wp-settings-X,
              wp-settings-time-X, etc.
            </li>
            <li>
              Analytical cookies and other cookies – these Cookies help us improve all our websites,
              collect anonymous information about how visitors use our websites, collect information
              about the most visited pages and tell us whether and how many error messages were
              displayed. Examples of analytical cookies: 1_P JAR, _ga, _gid, etc.
            </li>
            <li>
              Third-party cookies – these Cookies help third parties to help track and manage the
              effectiveness of, for example, their websites, ads, number of visitors. More
              information about these Cookies may be available on the relevant third party’s
              website. Examples of third-party cookies: sb, fr, spin, wd, xs, etc.
            </li>
            <li>
              Based on how long they are valid, the Cookies on the ARKONI websites may be either
              persistent cookies or session cookies: a persistent cookie will be stored by a web
              browser and will remain valid until its set expiry date, unless deleted by the user
              before the expiry date; a session cookie, on the other hand, will expire at the end of
              the user session, when the web browser is closed. If you want to receive more
              information about the cookies we use, please contact us.
            </li>
            <li>
              You can adjust your browser settings to delete some of our cookies or cookies set by
              third parties. You may also adjust your browser settings to prevent websites from
              setting cookies or third-party cookies altogether. If you prevent us from setting
              specific cookies, you may find that some functions are not available or that certain
              parts of the website will not load.
            </li>
          </ul>
          <h2>3. How we use your personal data</h2>
          <h2>3.1 For contacting you</h2>
          <p>
            We will use your email address, phone number, or other contact information you provide
            us by written or oral means for contacting you and providing you with the services and
            information that you request; it also allows us to correctly respond to your comments
            and questions.
          </p>
          <h2>3.2 For establishing business relations</h2>
          <p>
            If you are an existing customer of ARKONI or we reasonably believe that you might want
            to be our customer, we will use your email address, phone number, and other contact
            information you provide us by written or oral means for establishing a business
            relationship, sending you information about our services, and providing you with updates
            that may be related to your personal and professional interests.
          </p>
          <h2>3.3 For providing you with information</h2>
          <p>
            If you have subscribed to our updates, we will use the email address you provided to
            send information about our services, recent updates, latest products, case studies, and
            research.
          </p>
          <h2>3.4 For automated processing</h2>
          <p>
            If you visit the website, data about your behavior on the site will be automatically
            processed by cookies and third-party services to help us better understand your
            preferences and improve your experience on the website.
          </p>
          <h2>4. Third parties</h2>
          <p>
            To ensure the security of your sensitive information, we carefully select the
            third-party services that we use. We use exceptional services that claim they are
            compliant with GDPR and other data protection regulations. You can contact us at for
            more information about taking appropriate and suitable security measures.
          </p>
          <h2>4.1 Third-party services</h2>
          <p>
            Your data may be transferred to third-party services including Google Analytics,
            Leadfeeder, Google Tag Manager, Facebook, Mailchimp and Hotjar all of which are
            compliant with CCPA and other regulations. Their privacy policies can be found here:
          </p>
          <p>Google Analytics –https://policies.google.com/privacy</p>
          <p>Google Tag Manager –https://policies.google.com/privacy</p>
          <p>Facebook –https://www.facebook.com/about/privacy</p>
          <p>Mailchimp –https://mailchimp.com/legal/privacy</p>
          <p>Yandex.Metrika –https://metrica.yandex.com/about/info/privacy-policy</p>
          <h2>4.2 Subcontractors</h2>
          <p>
            Your data may also be transferred to subcontractors. During this process, data may be
            transferred to parties located in countries outside the USA that are not bound by USA
            data protection regulations (for example, to parties in Belarus). However, to protect
            your data, we always sign contracts with our subcontractors that contain provisions for
            the protection of user data.
          </p>
          <h2>5. How to withdraw your consent for collecting, processing, and using your data</h2>
          <p>
            You have the right to withdraw consent for collecting, processing, and using your data
            at any time by sending an email to contact@arkoni.io.
          </p>
          <p>
            If you are receiving our emails, you can unsubscribe by clicking the Unsubscribe button
            in any email or by just replying with a request to unsubscribe.
          </p>
          <h2>6. How long your data is stored for</h2>
          <p>
            Your data will be stored until the dayjs you withdraw your consent or our business
            relationship is broken off, whichever happens later.
          </p>
          <h2>7. Your rights as a data subject</h2>
          <p>You, as a Data Subject, have the right to:</p>
          <p>
            7.1 <b>Request information</b> about whether we hold personal information about you,
            and, if so, what that information is and why we are holding or using it.
          </p>
          <p>
            7.2 <b>Request access</b> to your personal information. This enables you to receive a
            copy of the personal information we hold about you and to check that we are lawfully
            processing it.
          </p>
          <p>
            7.3 <b> Request correction</b> of the personal information that we hold about you. This
            enables you to have any incomplete or inaccurate information we hold about you
            corrected.
          </p>
          <p>
            7.4 <b>Request erasure</b> of your personal information. This enables you to ask us to
            delete or remove personal information where there is no good reason for us continuing to
            process it. You also have the right to ask us to delete or remove your personal
            information where you have exercised your right to object to processing (see below).
          </p>
          <p>
            7.5 <b>Object to processing</b> of your personal information where we are relying on a
            legitimate interest (or those of a third party) and there is something about your
            particular situation which makes you want to object to processing on this ground. You
            also have the right to object where we are processing your personal information for
            direct marketing purposes.
          </p>
          <p>
            7.6 <b>Object to automated</b> decision-makin , including profiling, that is not to be
            subject of any automated decision-making by us using your personal information or
            profiling of you.
          </p>
          <p>
            7.7 <b>Request the restriction</b> of processing of your personal information. This
            enables you to ask us to suspend the processing of personal information about you, for
            example, if you want us to establish its accuracy or the reason for processing it.
          </p>
          <p>
            7.8 <b> Request transfer</b> of your personal information in an electronic and
            structured form to you or to another party. This enables you to take your data from us
            in an electronically useable format and to be able to transfer your data to another
            party in an electronically useable format.
          </p>
          <p>
            7.9 <b>Withdraw consent.</b> You have the right to withdraw your consent to the
            collection, processing and transfer of your personal information for a specific purpose
            at any time. Once we have received notification that you have withdrawn your consent, we
            will no longer process your information for the purpose or purposes you originally
            agreed to, unless we have another legitimate basis for doing so in law. The withdrawal
            of consent will not affect the lawfulness of processing based on consent prior to its
            withdrawal.
          </p>
          <h2>
            8. How you can raise a complaintIf you want to exercise any of the rights mentioned
            above, please contact us at contact@arkoni.io. The request response time is one month.
          </h2>
          <p>
            We may need to request specific information from you to help us confirm your identity
            and ensure your right to access the information or to exercise any of your other rights.
            This is another security measure to ensure that personal information is not disclosed to
            any person who has no right to receive it.
          </p>
          <p>
            Please exercise your rights wisely and note that abuse of rights may entail your
            liability.
          </p>
          <h2>9. Privacy Policy updates</h2>
          <p>
            We will update this Privacy Policy from time to time. Updates may be in response to
            changes to the existing law or changes to security standards and best practices for
            third-party services or tools that we use. We will update this Privacy Policy as we
            consider it necessary.
          </p>
        </div>
        <button type="button" onClick={animatedClose} className={`${BLOCK_NAME}__btn`}>
          Close
        </button>
      </div>
    </BackgroundBlur>
  );
};

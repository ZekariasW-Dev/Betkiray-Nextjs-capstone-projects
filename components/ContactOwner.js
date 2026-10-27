'use client';

import { useState } from 'react';
import { Phone, Mail, MessageCircle, X, Clock, User, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Link } from '@/i18n/navigation';

export function ContactOwner({ property }) {
  const { user, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { owner } = property;

  // Mask phone/whatsapp until tenant clicks reveal
  function mask(phone) {
    return phone.slice(0, 7) + ' *** ' + phone.slice(-3);
  }

  function openModal() {
    setOpen(true);
    setRevealed(false);
  }

  function closeModal() {
    setOpen(false);
  }

  // Handle backdrop click
  function onBackdrop(e) {
    if (e.target === e.currentTarget) closeModal();
  }

  const whatsappUrl = `https://wa.me/${owner.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${owner.name}, I'm interested in your listing: ${property.title} in ${property.neighborhood}, ${property.city}.`)}`;
  const mailUrl = `mailto:${owner.email}?subject=${encodeURIComponent(`Inquiry: ${property.title}`)}&body=${encodeURIComponent(`Hi ${owner.name},\n\nI found your listing on BetKiray and I'm interested in the ${property.propertyType.toLowerCase()} in ${property.neighborhood}, ${property.city}.\n\nCould you please share more details?\n\nThank you.`)}`;

  return (
    <>
      {/* ── CTA BUTTON ── */}
      <button className="contact-cta-btn btn btn-primary" onClick={openModal} type="button">
        <Phone size={18} aria-hidden="true" />
        Contact owner
      </button>

      {/* ── MODAL ── */}
      {open && (
        <div className="contact-modal-backdrop" onClick={onBackdrop} role="dialog" aria-modal="true" aria-label="Contact owner">
          <div className="contact-modal">
            {/* Header */}
            <div className="contact-modal-header">
              <div className="contact-modal-title">
                <span className="contact-modal-icon"><User size={18} /></span>
                <div>
                  <strong>{owner.name}</strong>
                  <span>Property owner</span>
                </div>
              </div>
              <button className="contact-modal-close icon-button" onClick={closeModal} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Property summary */}
            <div className="contact-modal-property">
              <p className="contact-modal-property-title">{property.title}</p>
              <p className="contact-modal-property-sub">{property.neighborhood}, {property.city}</p>
            </div>

            {/* Body: sign-in gate or contact options */}
            {!isLoading && !user ? (
              <div className="contact-signin-gate">
                <span className="contact-gate-icon"><Lock size={22} /></span>
                <p>Sign in to view owner contact details and get in touch.</p>
                <Link href="/login" className="btn btn-primary" onClick={closeModal}>
                  Sign in to contact
                </Link>
                <p className="contact-gate-register">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" onClick={closeModal}>Register free</Link>
                </p>
              </div>
            ) : (
              <div className="contact-options">
                {/* Response time */}
                <div className="contact-response-time">
                  <Clock size={14} aria-hidden="true" />
                  {owner.responseTime}
                </div>

                {/* WhatsApp — primary */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-option contact-option-whatsapp"
                >
                  <span className="contact-option-icon">
                    <MessageCircle size={20} />
                  </span>
                  <span className="contact-option-body">
                    <strong>WhatsApp</strong>
                    <span>Fastest way to reach the owner</span>
                  </span>
                  <ChevronRight size={16} className="contact-option-arrow" />
                </a>

                {/* Phone */}
                {revealed ? (
                  <a
                    href={`tel:${owner.phone}`}
                    className="contact-option contact-option-phone"
                  >
                    <span className="contact-option-icon">
                      <Phone size={20} />
                    </span>
                    <span className="contact-option-body">
                      <strong>Call</strong>
                      <span className="contact-number">{owner.phone}</span>
                    </span>
                    <ChevronRight size={16} className="contact-option-arrow" />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="contact-option contact-option-phone"
                    onClick={() => setRevealed(true)}
                  >
                    <span className="contact-option-icon">
                      <Phone size={20} />
                    </span>
                    <span className="contact-option-body">
                      <strong>Call</strong>
                      <span className="contact-number contact-number-masked">{mask(owner.phone)} · Tap to reveal</span>
                    </span>
                    <ChevronRight size={16} className="contact-option-arrow" />
                  </button>
                )}

                {/* Email */}
                <a
                  href={mailUrl}
                  className="contact-option contact-option-email"
                >
                  <span className="contact-option-icon">
                    <Mail size={20} />
                  </span>
                  <span className="contact-option-body">
                    <strong>Email</strong>
                    <span>{owner.email}</span>
                  </span>
                  <ChevronRight size={16} className="contact-option-arrow" />
                </a>

                <p className="contact-safety-note">
                  Never send money before viewing the property in person.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

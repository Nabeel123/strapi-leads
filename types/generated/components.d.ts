import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCapabilityFeature extends Struct.ComponentSchema {
  collectionName: 'components_sections_capability_features';
  info: {
    displayName: 'Capability Feature';
    name: 'CapabilityFeature';
  };
  attributes: {
    bullets: Schema.Attribute.Component<'shared.bullet', true>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsComparisonRow extends Struct.ComponentSchema {
  collectionName: 'components_sections_comparison_rows';
  info: {
    displayName: 'Comparison Row';
    name: 'ComparisonRow';
  };
  attributes: {
    ads: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    aiseen: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    coldCalling: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    feature: Schema.Attribute.String & Schema.Attribute.Required;
    referrals: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    sub: Schema.Attribute.String;
  };
}

export interface SectionsCtaBullet extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_bullets';
  info: {
    displayName: 'CTA Bullet';
    name: 'CtaBullet';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsPricingTier extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricing_tiers';
  info: {
    displayName: 'Pricing Tier';
    name: 'PricingTier';
  };
  attributes: {
    ctaHref: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#audit'>;
    ctaText: Schema.Attribute.String & Schema.Attribute.Required;
    features: Schema.Attribute.Component<'shared.bullet', true>;
    isPopular: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    priceLabel: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsStep extends Struct.ComponentSchema {
  collectionName: 'components_sections_steps';
  info: {
    displayName: 'Step';
    name: 'Step';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonial_items';
  info: {
    displayName: 'Testimonial Item';
    name: 'TestimonialItem';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface SectionsTestimonialStat extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonial_stats';
  info: {
    displayName: 'Testimonial Stat';
    name: 'TestimonialStat';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    sublabel: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsUseCaseItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_use_case_items';
  info: {
    displayName: 'Use Case Item';
    name: 'UseCaseItem';
  };
  attributes: {
    bonus: Schema.Attribute.Text;
    challenge: Schema.Attribute.Text;
    challengeLabel: Schema.Attribute.String;
    result: Schema.Attribute.String & Schema.Attribute.Required;
    results: Schema.Attribute.Component<'shared.bullet', true>;
    resultsLabel: Schema.Attribute.String;
    solution: Schema.Attribute.Text;
    solutionLabel: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedBullet extends Struct.ComponentSchema {
  collectionName: 'components_shared_bullets';
  info: {
    displayName: 'Bullet';
    name: 'Bullet';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooter extends Struct.ComponentSchema {
  collectionName: 'components_shared_footers';
  info: {
    displayName: 'Footer';
    name: 'Footer';
  };
  attributes: {
    copyright: Schema.Attribute.Text & Schema.Attribute.Required;
    links: Schema.Attribute.Component<'shared.footer-link', true>;
    siteName: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_links';
  info: {
    displayName: 'Footer Link';
    name: 'FooterLink';
  };
  attributes: {
    external: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHeader extends Struct.ComponentSchema {
  collectionName: 'components_shared_headers';
  info: {
    description: 'Header navigation configuration';
    displayName: 'Header';
    icon: 'menu';
    name: 'Header';
  };
  attributes: {
    ctaText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Free Audit'>;
    logo: Schema.Attribute.Media<'images'>;
    navItems: Schema.Attribute.Component<'shared.nav-item', true>;
    siteName: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    description: 'Homepage hero section - headline, subtitle, and CTAs';
    displayName: 'Hero';
    icon: 'star';
    name: 'Hero';
  };
  attributes: {
    badge: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Next-Gen Automation'>;
    primaryCtaHref: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#audit'>;
    primaryCtaIsAnchor: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    primaryCtaText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Get a Free Audit'>;
    secondaryCtaHref: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'/blog'>;
    secondaryCtaIsAnchor: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    secondaryCtaText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'View Case Studies'>;
    subtitle: Schema.Attribute.Text & Schema.Attribute.Required;
    titleAfter: Schema.Attribute.String;
    titleBefore: Schema.Attribute.String & Schema.Attribute.Required;
    titleHighlight: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLabels extends Struct.ComponentSchema {
  collectionName: 'components_shared_labels';
  info: {
    description: 'All user-facing strings - no hardcoded text in frontend';
    displayName: 'UI Labels';
    name: 'Labels';
  };
  attributes: {
    aboutNotFound: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'About content not found.'>;
    all: Schema.Attribute.String & Schema.Attribute.DefaultTo<'All'>;
    backToHome: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u2190 Back to home'>;
    blogSubtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Latest articles and insights.'>;
    blogTitle: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Blog'>;
    contactPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Get in touch for a free audit. Add content in your Strapi admin.'>;
    contactTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Contact'>;
    defaultCopyright: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u00A9 {year} AISEEN. All rights reserved.'>;
    defaultSiteName: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'AISEEN'>;
    noArticles: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'No articles yet.'>;
    noContent: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Add content in your Strapi admin.'>;
    privacyPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Add your privacy policy in Strapi Admin.'>;
    privacyTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Privacy Policy'>;
    skipToContent: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Skip to content'>;
    termsPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Add your terms of service in Strapi Admin.'>;
    termsTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Terms of Service'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedNavItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_items';
  info: {
    description: 'Navigation link - use #anchor for in-page scroll or /path for page navigation';
    displayName: 'Nav Item';
    icon: 'link';
    name: 'NavItem';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isAnchor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.capability-feature': SectionsCapabilityFeature;
      'sections.comparison-row': SectionsComparisonRow;
      'sections.cta-bullet': SectionsCtaBullet;
      'sections.pricing-tier': SectionsPricingTier;
      'sections.step': SectionsStep;
      'sections.testimonial-item': SectionsTestimonialItem;
      'sections.testimonial-stat': SectionsTestimonialStat;
      'sections.use-case-item': SectionsUseCaseItem;
      'shared.bullet': SharedBullet;
      'shared.footer': SharedFooter;
      'shared.footer-link': SharedFooterLink;
      'shared.header': SharedHeader;
      'shared.hero': SharedHero;
      'shared.labels': SharedLabels;
      'shared.media': SharedMedia;
      'shared.nav-item': SharedNavItem;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}

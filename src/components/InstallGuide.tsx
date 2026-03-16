import React from 'react'

interface InstallGuideProps {
  visible: boolean
  onClose: () => void
}

// Simple SVG illustrations for each install step

const IphoneShareIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="var(--accent)" fillOpacity="0.15"/>
    <path d="M14 5v12M10 9l4-4 4 4" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 13v7a1 1 0 001 1h10a1 1 0 001-1v-7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const AddHomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="var(--accent)" fillOpacity="0.15"/>
    <rect x="6" y="6" width="16" height="16" rx="3" stroke="var(--accent)" strokeWidth="1.5"/>
    <path d="M14 10v8M10 14h8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const TapAddIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="var(--accent)" fillOpacity="0.15"/>
    <rect x="7" y="11" width="14" height="7" rx="3.5" fill="var(--accent)"/>
    <text x="14" y="16.5" textAnchor="middle" fontSize="7" fill="white" fontWeight="600" fontFamily="system-ui">Add</text>
  </svg>
)

const SafariFileMenuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="var(--accent)" fillOpacity="0.15"/>
    <rect x="5" y="8" width="18" height="2.5" rx="1.25" fill="var(--accent)"/>
    <rect x="5" y="13" width="12" height="2.5" rx="1.25" fill="var(--accent)"/>
    <rect x="5" y="18" width="15" height="2.5" rx="1.25" fill="var(--accent)"/>
  </svg>
)

const DockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="var(--accent)" fillOpacity="0.15"/>
    <rect x="4" y="18" width="20" height="7" rx="3" fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="1"/>
    <rect x="8" y="19.5" width="4" height="4" rx="1" fill="var(--accent)"/>
    <rect x="16" y="19.5" width="4" height="4" rx="1" fill="var(--accent)" fillOpacity="0.5"/>
    <path d="M14 5v10M11 12l3 3 3-3" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Step-by-step phone mockup illustrations
const IphoneStep1 = () => (
  <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
    {/* Phone outline */}
    <rect x="30" y="4" width="60" height="72" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
    {/* Screen */}
    <rect x="34" y="10" width="52" height="54" rx="3" fill="var(--bg)"/>
    {/* URL bar */}
    <rect x="36" y="12" width="48" height="7" rx="3" fill="var(--surface2)"/>
    <text x="60" y="17.5" textAnchor="middle" fontSize="5" fill="var(--text-dim)" fontFamily="system-ui">md.getmarketingbull.com</text>
    {/* Content lines */}
    <rect x="36" y="22" width="30" height="4" rx="2" fill="var(--border)"/>
    <rect x="36" y="29" width="44" height="3" rx="1.5" fill="var(--border)" fillOpacity="0.6"/>
    <rect x="36" y="34" width="38" height="3" rx="1.5" fill="var(--border)" fillOpacity="0.6"/>
    {/* Bottom toolbar */}
    <rect x="34" y="56" width="52" height="8" rx="2" fill="var(--surface2)"/>
    {/* Share button highlighted */}
    <rect x="52" y="57.5" width="16" height="5" rx="2" fill="var(--accent)" fillOpacity="0.3" stroke="var(--accent)" strokeWidth="1"/>
    <path d="M60 58.5v3M58.5 59.5l1.5-1.5 1.5 1.5" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Arrow pointing to share button */}
    <path d="M60 72l0 -6" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrow)"/>
    <polygon points="60,66 57.5,70 62.5,70" fill="var(--accent)"/>
    {/* Home bar */}
    <rect x="48" y="76" width="24" height="2" rx="1" fill="var(--border)"/>
  </svg>
)

const IphoneStep2 = () => (
  <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
    {/* Phone outline */}
    <rect x="30" y="4" width="60" height="72" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
    {/* Share sheet sliding up */}
    <rect x="30" y="28" width="60" height="48" rx="0" fill="var(--surface)"/>
    <rect x="30" y="28" width="60" height="48" rx="0" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5"/>
    <rect x="32" y="28" width="56" height="48" rx="6" fill="var(--surface)"/>
    {/* Drag handle */}
    <rect x="50" y="31" width="20" height="2.5" rx="1.25" fill="var(--border)"/>
    {/* Share sheet items */}
    <rect x="35" y="37" width="50" height="11" rx="4" fill="var(--surface2)"/>
    {/* "Add to Home Screen" highlighted */}
    <rect x="35" y="51" width="50" height="11" rx="4" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="1"/>
    <text x="46" y="58.5" textAnchor="start" fontSize="5.5" fill="var(--accent)" fontFamily="system-ui" fontWeight="600">Add to Home Screen</text>
    <rect x="35" y="65" width="50" height="8" rx="4" fill="var(--surface2)"/>
    {/* Home bar */}
    <rect x="48" y="76" width="24" height="2" rx="1" fill="var(--border)"/>
  </svg>
)

const IphoneStep3 = () => (
  <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
    {/* Phone outline */}
    <rect x="30" y="4" width="60" height="72" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
    {/* Screen */}
    <rect x="34" y="10" width="52" height="54" rx="3" fill="var(--bg)"/>
    {/* Dialog */}
    <rect x="36" y="16" width="48" height="44" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="1"/>
    {/* App icon */}
    <rect x="50" y="20" width="20" height="20" rx="5" fill="#001a33"/>
    <text x="60" y="33" textAnchor="middle" fontSize="11" fontFamily="system-ui">#</text>
    {/* Name */}
    <text x="60" y="46" textAnchor="middle" fontSize="5" fill="var(--text)" fontFamily="system-ui">MB Editor</text>
    {/* Add button highlighted */}
    <rect x="38" y="52" width="44" height="6" rx="3" fill="var(--accent)"/>
    <text x="60" y="56.5" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="600" fontFamily="system-ui">Add</text>
    {/* Home bar */}
    <rect x="48" y="76" width="24" height="2" rx="1" fill="var(--border)"/>
  </svg>
)

const MacStep1 = () => (
  <svg width="140" height="80" viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
    {/* Mac screen */}
    <rect x="5" y="5" width="130" height="65" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
    {/* Traffic lights */}
    <circle cx="16" cy="13" r="3" fill="#ff5f57"/>
    <circle cx="25" cy="13" r="3" fill="#febc2e"/>
    <circle cx="34" cy="13" r="3" fill="#28c840"/>
    {/* Menu bar */}
    <rect x="5" y="5" width="130" height="18" rx="6" fill="var(--surface2)"/>
    <rect x="5" y="16" width="130" height="7" fill="var(--surface2)"/>
    {/* Menu items */}
    <text x="48" y="15" fontSize="6" fill="var(--text)" fontFamily="system-ui">Safari</text>
    {/* File menu highlighted */}
    <rect x="58" y="7" width="20" height="10" rx="2" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="0.8"/>
    <text x="68" y="14" textAnchor="middle" fontSize="6" fill="var(--accent)" fontFamily="system-ui" fontWeight="600">File</text>
    {/* Dropdown */}
    <rect x="58" y="17" width="55" height="30" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="1"/>
    <text x="62" y="25" fontSize="5.5" fill="var(--text)" fontFamily="system-ui">New Window</text>
    <text x="62" y="32" fontSize="5.5" fill="var(--text)" fontFamily="system-ui">Open Location…</text>
    {/* "Add to Dock" highlighted */}
    <rect x="59" y="35" width="53" height="9" rx="2" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="0.8"/>
    <text x="62" y="41" fontSize="5.5" fill="var(--accent)" fontFamily="system-ui" fontWeight="600">Add to Dock…</text>
    {/* Dock at bottom */}
    <rect x="20" y="62" width="100" height="10" rx="5" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1"/>
    {/* Stand */}
    <rect x="55" y="70" width="30" height="3" rx="1.5" fill="var(--border)"/>
    <rect x="45" y="73" width="50" height="2" rx="1" fill="var(--border)"/>
  </svg>
)

const MacStep2 = () => (
  <svg width="140" height="80" viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
    {/* Mac screen */}
    <rect x="5" y="5" width="130" height="65" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
    {/* Traffic lights */}
    <circle cx="16" cy="13" r="3" fill="#ff5f57"/>
    <circle cx="25" cy="13" r="3" fill="#febc2e"/>
    <circle cx="34" cy="13" r="3" fill="#28c840"/>
    {/* Menu bar */}
    <rect x="5" y="5" width="130" height="18" rx="6" fill="var(--surface2)"/>
    <rect x="5" y="16" width="130" height="7" fill="var(--surface2)"/>
    {/* Dialog */}
    <rect x="30" y="22" width="80" height="42" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
    {/* App icon in dialog */}
    <rect x="55" y="26" width="16" height="16" rx="4" fill="#001a33"/>
    <text x="63" y="36.5" textAnchor="middle" fontSize="9" fontFamily="system-ui">#</text>
    <text x="70" y="45" textAnchor="middle" fontSize="5" fill="var(--text)" fontFamily="system-ui">MB Editor</text>
    <text x="70" y="51" textAnchor="middle" fontSize="4.5" fill="var(--text-dim)" fontFamily="system-ui">md.getmarketingbull.com</text>
    {/* Buttons */}
    <rect x="36" y="55" width="25" height="6" rx="3" fill="var(--surface2)" stroke="var(--border)" strokeWidth="0.8"/>
    <text x="48.5" y="59.5" textAnchor="middle" fontSize="5" fill="var(--text)" fontFamily="system-ui">Cancel</text>
    {/* Add button highlighted */}
    <rect x="67" y="55" width="37" height="6" rx="3" fill="var(--accent)"/>
    <text x="85.5" y="59.5" textAnchor="middle" fontSize="5" fill="white" fontWeight="600" fontFamily="system-ui">Add to Dock</text>
    {/* Dock at bottom */}
    <rect x="20" y="62" width="100" height="10" rx="5" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1"/>
    {/* Stand */}
    <rect x="55" y="70" width="30" height="3" rx="1.5" fill="var(--border)"/>
    <rect x="45" y="73" width="50" height="2" rx="1" fill="var(--border)"/>
  </svg>
)

type Step = {
  icon: React.ReactNode
  title: string
  desc: string
  illustration: React.ReactNode
}

const iosSteps: Step[] = [
  {
    icon: <IphoneShareIcon />,
    title: 'Tap the Share button',
    desc: 'Open the app in Safari, then tap the Share button (⎋) in the browser toolbar at the bottom of the screen.',
    illustration: <IphoneStep1 />,
  },
  {
    icon: <AddHomeIcon />,
    title: 'Tap "Add to Home Screen"',
    desc: 'Scroll down in the Share sheet and tap "Add to Home Screen".',
    illustration: <IphoneStep2 />,
  },
  {
    icon: <TapAddIcon />,
    title: 'Tap "Add"',
    desc: 'Confirm the name (MB Editor) and tap "Add" in the top right. The app icon appears on your Home Screen.',
    illustration: <IphoneStep3 />,
  },
]

const macSteps: Step[] = [
  {
    icon: <SafariFileMenuIcon />,
    title: 'Open File → Add to Dock…',
    desc: 'In Safari, click the File menu in the menu bar, then choose "Add to Dock…" (requires macOS Sonoma 14 or later).',
    illustration: <MacStep1 />,
  },
  {
    icon: <DockIcon />,
    title: 'Click "Add to Dock"',
    desc: 'Confirm the app name and click "Add to Dock". The MB Editor icon will appear in your Dock.',
    illustration: <MacStep2 />,
  },
]

const StepCard: React.FC<{ step: Step; num: number }> = ({ step, num }) => (
  <div className="install-step">
    <div className="install-step-header">
      <span className="install-step-num">{num}</span>
      {step.icon}
      <span className="install-step-title">{step.title}</span>
    </div>
    <div className="install-step-body">
      <div className="install-step-illustration">{step.illustration}</div>
      <p className="install-step-desc">{step.desc}</p>
    </div>
  </div>
)

export const InstallGuide: React.FC<InstallGuideProps> = ({ visible, onClose }) => {
  return (
    <div className={`shortcuts-overlay ${visible ? 'visible' : ''}`} onClick={onClose}>
      <div
        className="shortcuts-modal install-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', width: '92vw' }}
      >
        <h3>📲 Install as App</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '20px' }}>
          Add MB Editor to your Home Screen or Dock for a full-screen, offline experience.
        </p>

        <h4 className="install-platform-heading">
          <span>📱</span> iPhone &amp; iPad (Safari)
        </h4>
        <div className="install-steps">
          {iosSteps.map((step, i) => (
            <StepCard key={i} step={step} num={i + 1} />
          ))}
        </div>

        <h4 className="install-platform-heading" style={{ marginTop: '24px' }}>
          <span>💻</span> Mac (Safari · macOS Sonoma 14+)
        </h4>
        <div className="install-steps">
          {macSteps.map((step, i) => (
            <StepCard key={i} step={step} num={i + 1} />
          ))}
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '16px', fontStyle: 'italic' }}>
          Tip: The app works offline once installed — no internet connection required.
        </p>

        <button className="shortcuts-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

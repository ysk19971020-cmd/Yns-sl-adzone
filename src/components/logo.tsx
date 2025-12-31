export function Logo() {
  return (
    <div className="flex items-center justify-center font-headline" aria-label="YNS SL ADZONE">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <path d="M4.5 19.5L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 21.5C17.4706 21.5 21.5 17.4706 21.5 12.5C21.5 7.52944 17.4706 3.5 12.5 3.5C7.52944 3.5 3.5 7.52944 3.5 12.5C3.5 14.1329 3.90971 15.6603 4.63231 16.9992" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11 10L14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 10L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="ml-2 text-xl font-bold text-foreground">
        YNS SL <span className="text-primary">ADZONE</span>
      </span>
    </div>
  );
}

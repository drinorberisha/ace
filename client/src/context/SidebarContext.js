import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext(undefined);

export function SidebarProvider({ children }) {
  const location = isBrowser() ? window.location.pathname : "/";
  const [isOpen, setOpen] = useState(false);

  // Close Sidebar on page change on mobile
  useEffect(() => {
    if (isSmallScreen()) {
      setOpen(false);
    }
  }, [location]);

  // Close Sidebar on mobile tap inside main content
  useEffect(() => {
    function handleMobileTapInsideMain(event) {
      const main = document.querySelector("main");
      const isClickInsideMain = main?.contains(event.target);

      if (isSmallScreen() && isClickInsideMain) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMobileTapInsideMain);
    return () => {
      document.removeEventListener("mousedown", handleMobileTapInsideMain);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpenOnSmallScreens: isOpen,
        isPageWithSidebar: true,
        setOpenOnSmallScreens: setOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isSmallScreen() {
  return isBrowser() && window.innerWidth < 768;
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebarContext should be used within the SidebarContext provider!"
    );
  }

  return context;
}

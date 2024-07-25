import React, { useContext } from "react";
import { Fragment, useState, useEffect } from "react";

import {
  Switch,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Input,
  DropdownItem,
  DropdownTrigger,
  Button,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
import { useRouter } from "next/router";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";
import UserContext from "@/context/userContext";
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from "./Icons.jsx";
import Link from "next/link";
import { useDarkMode } from "@/context/darkModeContext";
import DarkModeButton from "./darkModeButton/index.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Newnav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };
  const [fontStyle, setFontStyle] = useState("normal");

  const router = useRouter();
  const { user } = useContext(UserContext);
  //const user = {name: 'Erjon Hasanaj', email:'jonii.hasanaj@gmail.com'};

  console.log("User Data:", user);

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true); // New state variable
  const [isProfessor, setIsProfessor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userROLE  = localStorage.getItem("userRole");
    if(userROLE === "professor"){
      setIsProfessor(true);
      setIsAdmin(false);
    }else if(userROLE === "admin"){
      setIsProfessor(false);
      setIsAdmin(true);
    }else{
      setIsProfessor(false);
      setIsAdmin(false);
    }
    
    setIsLoggedIn(!!token); 
    setLoading(false); // Set loading to false after checking authentication status
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    window.location.href = "/auth/login"; // Redirect to the login page
  };

  const authenticatedNav = [
    { name: "Dashboard", href: "/", current: true },
    { name: "Profile", href: "/profile", current: false },
    { name: "Courses", href: "/courses", current: false },
  ];

  const publicNav = [
    { name: "Dashboard", href: "/", current: true },
    { name: "Login", href: "/auth/login", current: false },
    { name: "Register", href: "/auth/register", current: false },
    { name: "Courses", href: "/courses", current: false },
  ];

  const professorNav = [
    { name: "Dashboard", href: "/", current: false },
    { name: "Profile", href: "/professor", current: true },
    { name: "Courses", href: "/courses", current: false },
    { name: "CreateCourse", href: "/professor/AddCourse", current: false },

  ];
  const adminNav = [
    { name: "Dashboard", href: "/", current: false },
    { name: "Profile", href: "/admin", current: true },
    { name: "Courses", href: "/courses", current: false },
    { name: "AddCourse", href: "/admin/AddCourse", current: false },
    { name: "User Manager", href: "/admin/manageUsers", current: false },
// add some more links

  ];



  const navigation = isLoggedIn ? (isAdmin ? adminNav : (isProfessor ? professorNav : authenticatedNav)) : publicNav;
  const menuItems = navigation;
  // Update the current property based on the current path
  navigation.forEach((item) => {
    item.current = item.href === router.pathname;
  });


  const handleMouseEnter = () => {
    // setFontStyle('italic');
  };
  const handleMouseLeave = () => {
    // setFontStyle('normal');
  };

  if (loading) {
    return null; // or a loading spinner
  }
  return (
    <Navbar shouldHideOnScroll isBordered onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start">
      <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="mr-4">
          <Link href="/">
            <AcmeLogo />
          </Link>

          <Link href="/">
            <p className="hidden sm:block font-bold text-inherit">ACE</p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
        
          <div className="flex space-x-4">
            <NavbarItem isActive>
              {navigation.map((item) => (
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                  radius="sm"
                  variant="light"
                >
                  <Link
                    href={item.href}
                    key={item.name}
                    onClick={item.name === "Logout" ? handleLogout : null} // Add this line
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : " hover:bg-gray-700 hover:text-white",
                      fontStyle,
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                </Button>
              ))}
            </NavbarItem>
          </div>
        </NavbarContent>
        {isLoggedIn && (
            <Dropdown>
              <NavbarItem
                isActive
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                    endContent={icons.chevron}
                    radius="sm"
                    variant="light"
                  >
                    Features
                  </Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="ACME features"
                className="w-[340px]"
                itemClasses={{
                  base: "gap-4",
                }}
              >
                <DropdownItem
                  key="autoscaling"
                  description="ACME scales apps to meet user demand, automagically, based on load."
                  startContent={icons.scale}
                >
                  Autoscaling
                </DropdownItem>
                <DropdownItem
                  key="usage_metrics"
                  description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                  startContent={icons.activity}
                >
                  Usage Metrics
                </DropdownItem>
                <DropdownItem
                  key="production_ready"
                  description="ACME runs on ACME, join us and others serving requests at web scale."
                  startContent={icons.flash}
                >
                  Production Ready
                </DropdownItem>
                <DropdownItem
                  key="99_uptime"
                  description="Applications stay on the grid with high availability and high uptime guarantees."
                  startContent={icons.server}
                >
                  +99% Uptime
                </DropdownItem>
                <DropdownItem
                  key="supreme_support"
                  description="Overcome any challenge with a supporting team ready to respond."
                  startContent={icons.user}
                >
                  +Supreme Support
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <div className="max-w-full sm:max-w-[10rem] h-10 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </div>
          <input
            className="block w-full pl-10 pr-4 py-2 rounded-lg text-sm leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
            placeholder="Search"
          />
        </div>
        {isLoggedIn && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform avatar-class-name "
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">
                  {user ? user.email : "example@domain.com"}
                </p>
              </DropdownItem>
              <DropdownItem key="settings">
                <Link href="/profile/settings">My Settings</Link>
              </DropdownItem>
              {/* <DropdownItem key="team_settings">Team Settings</DropdownItem> */}
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem onClick={handleLogout} key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      <DarkModeButton />
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

import classNames from "classnames";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { useSidebarContext } from "@/context/SidebarContext";

const Sidebar = function ({ children }) {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } = useSidebarContext();

  return (
    <div
      className={classNames(
        "fixed overflow-auto top-0 h-screen z-10 lg:sticky lg:!block",
        {
          hidden: !isSidebarOpenOnSmallScreens,
        }
      )}
    >
      <FlowbiteSidebar>{children}</FlowbiteSidebar>
    </div>
  );
};

export default Object.assign(Sidebar, { ...FlowbiteSidebar });

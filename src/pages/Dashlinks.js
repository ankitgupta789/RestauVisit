const ACCOUNT_TYPE = {
    STUDENT: "Student",
    INSTRUCTOR: "Instructor",
    ADMIN: "Admin",
  }

  
export const sidebarLinks = [
    {
      id: 1,
      name: "My Profile",
      path: "/dashboard/my-profile",
      icon: "VscAccount",
    },
    {
      id: 2,
      name: "Dashboard",
      path: "/dashboard/instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
      icon: "VscDashboard",
    },
    {
      id: 3,
      name: "My Documents",
      path: "/mydoc",
      type: ACCOUNT_TYPE.INSTRUCTOR,
      icon: "VscVm",
    },
    {
      id: 4,
      name: "Add Document",
      path: "/dashboard/addDocument",
      type: ACCOUNT_TYPE.INSTRUCTOR,
      icon: "VscAdd",
    },
    {
      id: 5,
      name: "Saved Documents",
      path: "/dashboard/enrolled-courses",
      type: ACCOUNT_TYPE.STUDENT,
      icon: "VscMortarBoard",
    },
    {
      id: 6,
      name: "Progress",
      path: "/dashboard/purchase-history",
      type: ACCOUNT_TYPE.STUDENT,
      icon: "VscHistory",
    },
    
    {
      id: 7,
      name: "Cart",
      path: "/dashboard/cart",
      type: ACCOUNT_TYPE.STUDENT,
      icon: "VscArchive",
    },
  
  ];
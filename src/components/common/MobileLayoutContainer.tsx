import React, { ReactNode } from "react";

interface MobileLayoutContainerProps {
  children: ReactNode;
}

const MobileLayoutContainer: React.FC<MobileLayoutContainerProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen w-full sm:bg-[#b8c6d9] sm:flex sm:justify-center sm:items-start">
      <div className="w-full min-h-screen bg-white sm:max-w-[430px] sm:shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default MobileLayoutContainer;

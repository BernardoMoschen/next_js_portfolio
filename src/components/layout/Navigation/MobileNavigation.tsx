import React from 'react';
import MobileMenuButton from './MobileMenuButton';
import MobileDrawer from './MobileDrawer';

interface MenuItem {
    label: string;
    href: string;
}

interface MobileNavigationProps {
    open: boolean;
    onToggle: () => void;
    onMenuClick: (sectionId: string) => void;
    activeSection: string;
    menuItems: MenuItem[];
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
    open,
    onToggle,
    onMenuClick,
    activeSection,
    menuItems,
}) => {
    return (
        <>
            <MobileMenuButton onClick={onToggle} />
            <MobileDrawer
                open={open}
                onClose={onToggle}
                menuItems={menuItems}
                activeSection={activeSection}
                onMenuClick={onMenuClick}
            />
        </>
    );
};

export default MobileNavigation;

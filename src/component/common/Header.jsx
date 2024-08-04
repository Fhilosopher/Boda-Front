import Logo from "../../assets/img/logo.svg";
import React from "react";
import styled from "styled-components";

function Header({ handleHome, handleMyInfo, handleLogOut }) {
  return (
    <Head>
      <ServiceImg onClick={handleHome} src={Logo} alt="Logo" />
      <ServiceNav>
        <NavItem onClick={handleMyInfo}>My Page</NavItem>
        <NavItem onClick={handleLogOut}>Log Out</NavItem>
      </ServiceNav>
    </Head>
  );
}

const Head = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 40px 26px 30px;
  align-items: center;
  justify-content: space-between;
`;

const ServiceImg = styled.img`
  cursor: pointer;
  height: 30px;
`;

const ServiceNav = styled.div`
  gap: 50px;
  display: flex;
  font-size: 20px; /* 예시 스타일 */
  color: #3a3a3b;
  cursor: pointer;
`;

const NavItem = styled.h3`
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: #3a3a3b;
    z-index: -1;
    transition: width 0.3s ease-in-out;
  }

  &:hover {
    color: white;

    &::before {
      width: 100%;
    }
  }
`;

export default Header;

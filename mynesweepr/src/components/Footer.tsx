import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  margin-top: 20px;
  font-size: 12px;
  text-align: center;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>
        The FontStruction “MINE-SWEEPER” by Gangetsha Lyx is licensed under a
        Creative Commons Attribution Share Alike license.{" "}
        <a
          href="http://creativecommons.org/licenses/by-sa/3.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
        .
      </p>
      <p>
        This project includes icons from the{" "}
        <a
          href="https://github.com/realm/Realm-Sweeper"
          target="_blank"
          rel="noopener noreferrer"
        >
          Realm-Sweeper project
        </a>
        , which is licensed under the Apache 2.0 license.{" "}
        <a
          href="(http://www.apache.org/licenses/LICENSE-2.0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
      </p>
    </FooterContainer>
  );
};

export default Footer;

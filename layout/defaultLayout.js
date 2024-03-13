import React from "react";
import { Sidebar } from "@/_metronic/layout/components/sidebar";

const defaultLayout = ({ children }) => {
  return (
    <div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
        <div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
          {/* <HeaderWrapper /> */}
          <div className='app-wrapper flex-column flex-row-fluid' id='kt_app_wrapper'>
            <Sidebar />
            <div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
              <div className='d-flex flex-column flex-column-fluid'>
                {children}
              </div>
              {/* <FooterWrapper /> */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default defaultLayout;

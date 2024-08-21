import React, { useEffect } from "react";
import { withConfig } from "../Config";

const Page2 = ({ config }) => {
  useEffect(() => {
    document.title = `Page 1 - ${config.short_name}`;
  }, [config]);

  return (
    <div>
      Hai Ini Adalah Page 1<br></br>
      <a href="/page2">Go to page 2</a>
    </div>
  );
};

export default withConfig(Page2);

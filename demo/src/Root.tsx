import { Composition, registerRoot } from "remotion";
import { CodexSkillDemo } from "./CodexSkillDemo";
import { BeforeAfter } from "./BeforeAfter";
import React from "react";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CodexSkillDemo"
        component={CodexSkillDemo}
        durationInFrames={300}
        fps={30}
        width={1200}
        height={630}
      />
      <Composition
        id="BeforeAfter"
        component={BeforeAfter}
        durationInFrames={300}
        fps={30}
        width={1200}
        height={630}
      />
    </>
  );
};

registerRoot(RemotionRoot);

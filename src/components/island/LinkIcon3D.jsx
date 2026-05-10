import React from 'react';
import { View } from '@react-three/drei';
import CottageIcon from './icons/CottageIcon';
import FarmIcon from './icons/FarmIcon';
import DweepaIcon from './icons/DweepaIcon';
import GithubIcon from './icons/GithubIcon';
import InstagramIcon from './icons/InstagramIcon';
import EmailIcon from './icons/EmailIcon';

const ICON_MAP = {
  cottage: CottageIcon,
  farm: FarmIcon,
  dweepa: DweepaIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  email: EmailIcon,
};

export default function LinkIcon3D({ type, hovered }) {
  const Icon = ICON_MAP[type];
  if (!Icon) return <div className="link-icon-view" />;

  return (
    <View className="link-icon-view">
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 2]} intensity={1.2} />
      <group scale={1.5}>
        <Icon hovered={hovered} />
      </group>
    </View>
  );
}

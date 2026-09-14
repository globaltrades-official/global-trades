import React, { forwardRef } from 'react';
import { Float } from '@react-three/drei';
import { Product3DDisplay } from './Product3DDisplay';

const FloatingProduct = forwardRef(
  (
    {
      product,
      flavor,
      accentColor,
      textureUrl = '/company-logo.png',
      scale,
      floatSpeed = 1.5,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
      children,
      ...props
    },
    ref
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}
          <Product3DDisplay
            scale={scale || 1.8}
            accentColor={accentColor || '#00A3E0'}
            textureUrl={textureUrl}
          />
        </Float>
      </group>
    );
  }
);

FloatingProduct.displayName = 'FloatingProduct';

export default FloatingProduct;

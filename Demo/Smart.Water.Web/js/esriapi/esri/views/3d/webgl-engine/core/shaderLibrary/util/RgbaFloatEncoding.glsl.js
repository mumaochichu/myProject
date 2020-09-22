// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.16/esri/copyright.txt for details.
//>>built
define(["require","exports","tslib","../../shaderModules/interfaces"],function(f,a,d,e){Object.defineProperty(a,"__esModule",{value:!0});a.RgbaFloatEncoding=function(a){var c=e.glsl(b||(b=d.__makeTemplateObject(["\n    // This is the maximum float value representable as 32bit fixed point,\n    // it is rgba2float(vec4(1)) inlined.\n    const float MAX_RGBA_FLOAT \x3d\n      255.0 / 256.0 +\n      255.0 / 256.0 / 256.0 +\n      255.0 / 256.0 / 256.0 / 256.0 +\n      255.0 / 256.0 / 256.0 / 256.0 / 256.0;\n\n    // Factors to convert to fixed point, i.e. factors (256^0, 256^1, 256^2, 256^3)\n    const vec4 FIXED_POINT_FACTORS \x3d vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);\n\n    vec4 float2rgba(const float value) {\n      // Make sure value is in the domain we can represent\n      float valueInValidDomain \x3d clamp(value, 0.0, MAX_RGBA_FLOAT);\n\n      // Decompose value in 32bit fixed point parts represented as\n      // uint8 rgba components. Decomposition uses the fractional part after multiplying\n      // by a power of 256 (this removes the bits that are represented in the previous\n      // component) and then converts the fractional part to 8bits.\n      vec4 fixedPointU8 \x3d floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);\n\n      // Convert uint8 values (from 0 to 255) to floating point representation for\n      // the shader\n      const float toU8AsFloat \x3d 1.0 / 255.0;\n\n      return fixedPointU8 * toU8AsFloat;\n    }\n\n    // Factors to convert rgba back to float\n    const vec4 RGBA_2_FLOAT_FACTORS \x3d vec4(\n      255.0 / (256.0),\n      255.0 / (256.0 * 256.0),\n      255.0 / (256.0 * 256.0 * 256.0),\n      255.0 / (256.0 * 256.0 * 256.0 * 256.0)\n    );\n\n    float rgba2float(vec4 rgba) {\n      // Convert components from 0-\x3e1 back to 0-\x3e255 and then\n      // add the components together with their corresponding\n      // fixed point factors, i.e. (256^1, 256^2, 256^3, 256^4)\n      return dot(rgba, RGBA_2_FLOAT_FACTORS);\n    }\n  "],
["\n    // This is the maximum float value representable as 32bit fixed point,\n    // it is rgba2float(vec4(1)) inlined.\n    const float MAX_RGBA_FLOAT \x3d\n      255.0 / 256.0 +\n      255.0 / 256.0 / 256.0 +\n      255.0 / 256.0 / 256.0 / 256.0 +\n      255.0 / 256.0 / 256.0 / 256.0 / 256.0;\n\n    // Factors to convert to fixed point, i.e. factors (256^0, 256^1, 256^2, 256^3)\n    const vec4 FIXED_POINT_FACTORS \x3d vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);\n\n    vec4 float2rgba(const float value) {\n      // Make sure value is in the domain we can represent\n      float valueInValidDomain \x3d clamp(value, 0.0, MAX_RGBA_FLOAT);\n\n      // Decompose value in 32bit fixed point parts represented as\n      // uint8 rgba components. Decomposition uses the fractional part after multiplying\n      // by a power of 256 (this removes the bits that are represented in the previous\n      // component) and then converts the fractional part to 8bits.\n      vec4 fixedPointU8 \x3d floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);\n\n      // Convert uint8 values (from 0 to 255) to floating point representation for\n      // the shader\n      const float toU8AsFloat \x3d 1.0 / 255.0;\n\n      return fixedPointU8 * toU8AsFloat;\n    }\n\n    // Factors to convert rgba back to float\n    const vec4 RGBA_2_FLOAT_FACTORS \x3d vec4(\n      255.0 / (256.0),\n      255.0 / (256.0 * 256.0),\n      255.0 / (256.0 * 256.0 * 256.0),\n      255.0 / (256.0 * 256.0 * 256.0 * 256.0)\n    );\n\n    float rgba2float(vec4 rgba) {\n      // Convert components from 0-\x3e1 back to 0-\x3e255 and then\n      // add the components together with their corresponding\n      // fixed point factors, i.e. (256^1, 256^2, 256^3, 256^4)\n      return dot(rgba, RGBA_2_FLOAT_FACTORS);\n    }\n  "])));
a.fragment.code.add(c);a.vertex.code.add(c)};var b});
import type { SVGProps } from 'react';

/**
 * The X (formerly Twitter) logo. Lucide only ships the retired bird as
 * `Twitter`, so this stands in for it with the same call shape:
 * `size`, `className` and `strokeWidth` are accepted the way a Lucide
 * icon accepts them. The mark is a filled glyph, so `strokeWidth` is
 * taken and ignored rather than leaking onto the <svg>.
 *
 * The viewBox is padded by 2 units on each side so the glyph sits at
 * the same optical size as the outline icons it shares a row with
 * (LinkedIn, YouTube): unpadded, it fills its box edge to edge and
 * reads a size larger.
 */
type XIconProps = Omit<SVGProps<SVGSVGElement>, 'strokeWidth'> & {
  size?: number | string;
  strokeWidth?: number | string;
};

export default function XIcon({ size = 24, strokeWidth: _strokeWidth, ...rest }: XIconProps) {
  void _strokeWidth;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -2 28 28"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...rest}
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

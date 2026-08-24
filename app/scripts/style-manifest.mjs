export const styleGroups = [
  {
    name: 'vendor',
    files: ['bootstrap.min.css', 'boxicon.css', 'tablesaw.css', 'style.css']
  },
  {
    name: 'foundation',
    files: ['pihub-foundation.css']
  },
  {
    name: 'analytical',
    files: ['pihub-analytical.css']
  },
  {
    name: 'hardening',
    files: ['pihub-hardening.css']
  },
  {
    name: 'shell',
    files: ['pihub-shell.css']
  },
  {
    name: 'motion',
    files: ['pihub-motion.css']
  },
  {
    name: 'product',
    files: ['pihub-product.css']
  },
  {
    name: 'canonical',
    files: ['pihub-system.css']
  }
];

export const runtimeStyleFiles = styleGroups.flatMap(group => group.files);

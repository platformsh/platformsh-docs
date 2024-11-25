/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "../../themes/**/layouts/**/*.html",
    "../../themes/**/content/**/*.{html,md}",
    "./static/scripts/xss/**/*.js"
  ],
  safelist: ['-rotate-90','bg-pink-light'],
  theme: {
    extend: {
      backgroundPosition: {
        "left-4": "1rem center",
        "right-2": "right 0.5rem center"
      },
      colors: {
        "ebony": "#302F45",
        "ebony-light": "#4A495E",
        "grey": "#F0F2F5",
        "grey-dark": "#8C94A1",
        "pink": "#FFBDBB",
        "pink-light": "#FFD9D9",
        "primary-darker": "#171719",
        "skye": "#4786FF",
        "skye-light": "#E7F0FF",
        "skye-dark": "#1664FF",
        "slate": "#5F5E70",
        "snow": "#FFFFFF",
        "stone": "#E7E7E7",
      },
      fontFamily: {
        sans: ["Overpass", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"]
      },
      gridTemplateColumns: {
        "80-20": "minmax(20rem,80%) minmax(10rem,20%)",
      },
      spacing: {
        "fullv": "calc(100vh - 6rem)",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.skye-dark'),
              textDecoration: 'none',
              fontWeight: '400',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            code: {
              marginBottom: '0',
              color: theme('colors.skye'),
              backgroundColor: theme('colors.stone'),
              fontWeight: '400',
              padding: '0.25rem',
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            h2: {
              img: {
                display: 'inline',
              },
              fontWeight: '900',
            },
            h3: {
              img: {
                display: 'inline',
              },
              fontWeight: '500',
            },
            h4: {
              img: {
                display: 'inline',
              },
              fontWeight: '300',
            },
            h5: {
              img: {
                display: 'inline',
              },
              fontWeight: '400',
            },
            h6: {
              img: {
                display: 'inline',
              },
              fontWeight: '500',
            },
            kbd: {
              padding: '0.2rem 0.4rem',
              color: theme('colors.skye'),
              backgroundColor: theme('colors.stone'),
              borderRadius: '0.2rem',
              boxShadow: 'inset 0 -2px 0 var(--primary)',
            },
            p: {
              color: theme('colors.ebony-light'),
            },
            pre: {
              backgroundColor: theme('colors.stone'),
              borderRadius: '0',
              color: theme('colors.ebony-light'),
              lineHeight: '1.5rem',
              marginTop: '0',
            },
            table: {
              position: 'relative',
              zIndex: '10',
              backgroundColor: theme('colors.snow'),
            },
            tbody: {
              'td:first-child': {
                paddingLeft: '0.5rem',
              },
              'td:last-child': {
                paddingRight: '0.5rem',
              },
            },
            td: {
              border: `1px solid ${theme('colors.stone')}`,
            },
            th: {
              backgroundColor: theme('colors.stone'),
              padding: '0.5rem',
              code: {
                backgroundColor: theme('colors.snow'),
              },
            },
            thead: {
              position: 'sticky',
              top: '6rem',
              'th:first-child': {
                paddingLeft: '0.5rem',
              },
              'th:last-child': {
                paddingRight: '0.5rem',
              },
            },
            var: {
              color: theme('colors.skye-dark'),
              textDecoration: `underline ${theme('colors.skye-dark')} dotted 2px`,
              fontStyle: 'italic',
              cursor: 'help',
            },
          },
        },
        lg: {
          css: {
            pre: {
              lineHeight: '1.5rem',
              marginTop: '0',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}

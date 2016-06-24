import sys

GREEN = '<td style="background-color: #39b54a; color: #fff">{}</td>'
RED = '<td style="background-color: #ab2918; color: #fff">{}</td>'

for i in sys.stdin:
  ext, p54, p55, p56, p70 = i.split('|')

  p54 = GREEN.format('PHP 5.4') if p54.strip() == '*' else RED.format('PHP 5.4')
  p55 = GREEN.format('PHP 5.5') if p55.strip() == '*' else RED.format('PHP 5.5')
  p56 = GREEN.format('PHP 5.6') if p56.strip() == '*' else RED.format('PHP 5.6')
  p70 = GREEN.format('PHP 7.0') if p70.strip() == '*' else RED.format('PHP 7.0')

  print '<tr><td>{}</td>{}{}{}{}</tr>'.format(ext, p54, p55, p56, p70)

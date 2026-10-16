#!/usr/bin/env python3
# Assemble une page unique : style + core + modules -> dist/index.html
import glob,os,sys
root=os.path.dirname(os.path.abspath(__file__))
css=open(root+'/src/style.css').read()
core=open(root+'/src/core.js').read()
mods=''.join('\n/* ==== %s ==== */\n'%os.path.basename(f)+open(f).read() for f in sorted(glob.glob(root+'/src/modules/*.js')))
html='''<title>Pack 3e MENA</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:wght@600;800&display=swap">
<style>%s</style>
<div id="app"></div>
<script>%s</script>
<script>%s
Lab.start();</script>
'''%(css,core,mods)
os.makedirs(root+'/dist',exist_ok=True)
open(root+'/dist/index.html','w').write(html)
print('dist/index.html',len(html)//1024,'Ko')

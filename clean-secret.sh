#!/bin/bash
find . -type f -name '*.py' -o -name '*.js' -o -name '*.ts' -o -name '*.json' -o -name '.env*' | while read file; do
  if [ -f "\" ]; then
    sed -i 's/AIzaSyBOyxYj_2ypQP3oyTpFLkpM4q70ck_XtUA/REMOVED_SECRET/g' "\" 2>/dev/null || true
  fi
done
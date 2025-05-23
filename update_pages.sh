#!/bin/bash

# Find all HTML files in the pages directory
HTML_FILES=$(find pages -name "*.html")

# For each HTML file, remove the inline script
for file in $HTML_FILES; do
  echo "Updating $file..."
  # Remove the inline script section
  sed -i '' -e '/<script>/{N;N;N;d;}' "$file"
  echo "Done updating $file"
done

echo "All HTML files updated successfully!" 
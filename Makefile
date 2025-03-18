optimize-images:
	find sites -iname '*.png' -exec optipng {} \;
	find sites -iname '*.jpg' -exec jpegoptim {} \;

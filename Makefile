.PHONY: zip

zip: chrome-buildbot-autoscroll.zip

chrome-buildbot-autoscroll.zip: buildbotautoscroll.js manifest.json nut128.png nut48.png nut16.png
	rm $@
	zip $@ $+

version = $(shell jq .version package.json | sed 's/"//g')

sync:
	@mkdir -p docs; \
		echo "<meta http-equiv=\"refresh\" content=\"0; url=$(version)\" />" > docs/index.html
	@mkdir -p docs/latest; \
		echo "<script>window.location.replace(\"../$(version)/\" + window.location.search);</script>" > docs/latest/index.html
	@versions="$$(find docs -name "version.json" | cut -d '/' -f 2 \
		| sed '/-/!{s/$$/_/;}; s/-patch/_patch/; ' | sort -rV | sed 's/_$$//; s/_patch/-patch/' \
		| sed 's/\(^.*$$\)/    "\1"/g; $$ ! s/$$/,/g; $$s/$$/\n/ ;')";\
	for file in $$(find docs -name "version.json"); do \
		current=$$(basename "$$(dirname "$$file")"); \
		echo "{\n  \"current\": \"$$current\",\n  \"versions\": [\n$$versions\n  ]\n}" > $$file; \
	done
var includes = [
    "cam",
	"jquery",
	"rgb2hsv"
];

for(var include in includes)
    document.write('<script type="text/javascript" src="script/' + includes[include] + '.js"></script>');

/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function () {
	// Center window on screen.
	var screenWidth = screen.availWidth;
	var screenHeight = screen.availHeight;
	var width = 1024;
	var height = 768;

	chrome.app.window.create(
		'index.html',
		{
			id: 'Woodash',
            frame: {
                color: '#303F9F',
                inactiveColor: '#00ff00'
            },
			bounds: {
				width: width,
				height: height,
				left: Math.round((screenWidth - width) / 2),
				top: Math.round((screenHeight - height) / 2)
			}
		}
	);
});
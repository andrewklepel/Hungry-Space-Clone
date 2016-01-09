$(function() {
	var eatenCount = 0;

	$('#startButton').click(function() {
		startGame();
		$('#startMessage').css("display", "none");
		$('#cursor').css("display", "");
	});

	// update the cursor whenever the mouse is moved
	$(document).on("mousemove", function(event) {
		$('#cursor').attr("x", event.pageX);
		$('#cursor').attr("y", event.pageY);
	});

	function startGame()
	{
		// reset various game settings
		$('#cursor').attr("height", "20px");
		$('#cursor').attr("width", "50px");
		$('.point').each(function(i, obj) {
			$(obj).remove();
		});
		eatenCount = 0;
		
		var mainLoop = setInterval(function () {
			if ($('.point').length < 15) // ensure there's always x number of points on the map
				createPoint();
		
			$('.point').each(function(i, obj) {
				if (overlap($('#cursor'), $(obj)))
				{
					if (parseInt($(obj).attr('width')) > parseInt($('#cursor').attr('width'))) // you lose if the point was bigger than you
					{
						clearInterval(mainLoop); // stop main loop
						$('#startMessage').css("display", "");
						$('#cursor').css("display", "none");
						$('#innerMessage').html("You were eaten by something bigger than you! Your eaten score is " + eatenCount + ".");
					}
					else // you ate another point
					{
						$(obj).remove();
						$('#cursor').attr("width", 50 * Math.pow(1.03, eatenCount));
						$('#cursor').attr("height", 20 * Math.pow(1.03, eatenCount));
						eatenCount++;
					}
				}
				else
				{
					var x = parseInt($(obj).attr('x'));
					var y = parseInt($(obj).attr('y'));
					var height = parseInt($(obj).attr('height'));
					var width = parseInt($(obj).attr('width'));
					var id = parseInt($(obj).attr('data-id'));
					var speed = parseInt($(obj).attr('data-speed'));
					
					// delete the object if it goes off the screen
					if (x + width < 0 || x > self.innerWidth || y + height < 0 || y > self.innerHeight)
						$(obj).remove();
					else
					{	
						if (id % 4 == 0)
							$(obj).attr('x', (x + speed));
						else if (id % 4 == 1)
							$(obj).attr('x', (x - speed));
						else if (id % 4 == 2)
							$(obj).attr('y', (y + speed));
						else if (id % 4 == 3)
							$(obj).attr('y', (y - speed));
					}
				}
			});
			
			if (parseInt($('#cursor').attr("height")) > (self.innerHeight/5)) // if your size is bigger than 1/x the screen height, you win
			{
				clearInterval(mainLoop); // stop main loop
				$('#startMessage').css("display", "");
				$('#cursor').css("display", "none");
				$('#innerMessage').html("You win!");
			}
		}, 10);
	}

	// checks if two rectangles intersect on the x-y plane
	function overlap(A, B)
	{
		var aX = parseInt(A.attr('x'));
		var aY = parseInt(A.attr('y'));
		var aHeight = parseInt(A.attr('height'));
		var aWidth = parseInt(A.attr('width'));
		var bX = parseInt(B.attr('x'));
		var bY = parseInt(B.attr('y'));
		var bHeight = parseInt(B.attr('height'));
		var bWidth = parseInt(B.attr('width'));
		
		// if ax1 and ax2 both occur before bx1, or after bx2, then the x plane doesn't intersect
		var xOverlap = !( ( (aX < bX) && (aX + aWidth < bX) ) || ( (aX > bX + bWidth) && (aX + aWidth > bX + bWidth) ) );
		// same, except for the y plane
		var yOverlap = !( ( (aY < bY) && (aY + aHeight < bY) ) || ( (aY > bY + bHeight) && (aY + aHeight > bY + bHeight) ) );
		
		return xOverlap && yOverlap; // if both the x and y plane intersect, a collision has occurred
	}

	var totalPointCount = 0;
	function createPoint()
	{
		// seed the canvas with points
		var svgns = "http://www.w3.org/2000/svg";
		
		var width = (20 + Math.random() * 80) * Math.pow(1.03, eatenCount);
		var height = width*.4; // height to width ratio here
		
		var x = 0;
		var y = 0;
		
		if (totalPointCount % 4 == 0)
		{
			x = 0 - width;
			y = Math.random() * self.innerHeight;
		}
		else if (totalPointCount % 4 == 1)
		{
			x = self.innerWidth;
			y = Math.random() * self.innerHeight;
		}
		else if (totalPointCount % 4 == 2)
		{
			x = Math.random() * self.innerWidth;
			y = 0 - height;
		}
		else if (totalPointCount % 4 == 3)
		{
			x = Math.random() * self.innerWidth;
			y = self.innerHeight;
		}
		
		var rect = document.createElementNS(svgns, 'image');
		rect.setAttributeNS(null, 'x', x);
		rect.setAttributeNS(null, 'y', y);
		rect.setAttributeNS(null, 'height', height);
		rect.setAttributeNS(null, 'width', width);
		rect.setAttributeNS(null, 'class', 'point');
		rect.setAttributeNS(null, 'data-id', totalPointCount);
		rect.setAttributeNS(null, 'data-speed', (Math.random() * 3) + 3);
		rect.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'badbaggie.png');
		document.getElementById('canvas').appendChild(rect);
		
		totalPointCount++;
	}
});
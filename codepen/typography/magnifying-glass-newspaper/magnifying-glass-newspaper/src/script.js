// helper functions
const normalize = (va, mi, ma) => (va - mi) / (ma - mi),
			interpolate = (no, mi, ma) => mi + (ma - mi) * no,
			map = (va, mi1, ma1, mi2, ma2) => interpolate(normalize(va, mi1, ma1), mi2, ma2);

// some setup
const viewer = document.getElementById("viewer"),
			paper = document.getElementById("paper"),
			glass = document.getElementById("glass"),
			offset = 50, // dragging calculated with edge to make it feel more comfortable
			smoothFactor = .28, // x and y are not set, but with tendency towards target (tx, ty)
			STATUS_IDLE = 1, // idle
			STATUS_DRAG = 2, // dragging
			STATUS_FADE = 3; // post dragging

// initial positions
let glassPos = { x: 0, y: 0, tx: 0, ty: 0 },
		glassBackPos = { x: 0, y: 0, tx: 0, ty: 0 },
		paperPos = { x: 0, y: 0, tx: 0, ty: 0 },
		status = STATUS_IDLE;

// handle beginning of touch
const touchstart = (e) => {
	if (status === STATUS_DRAG) return;
	status = STATUS_DRAG;
	if (!glass.classList.contains("active")) glass.classList.add("active");
};

// handle movement after touch started
const touchmove = (e) => {
	// prevent non dragging artifacts
	if (status !== STATUS_DRAG) return;
	
	// prevent default behaviours
	e.preventDefault();
	
	// setup some numbers
	const cx = e.type == 'touchmove' ? e.touches[0].clientX : e.clientX,
				cy = e.type == 'touchmove' ? e.touches[0].clientY : e.clientY,
				rect = viewer.getBoundingClientRect(),
				x = Math.min(viewer.clientWidth - offset, Math.max(offset, Math.min(viewer.clientWidth, cx - rect.left))),
				y = Math.min(viewer.clientHeight - offset, Math.max(offset, Math.min(viewer.clientHeight, cy - rect.top))),
				normX = normalize(x, offset, viewer.clientWidth - offset),
				normY = normalize(y, offset, viewer.clientHeight - offset),
				diffX = paper.clientWidth - viewer.clientWidth,
				diffY = paper.clientHeight - viewer.clientHeight;
	
	// determine glass position
	glassPos.tx = interpolate(normX, 0, viewer.clientWidth - glass.clientWidth); 
	glassPos.ty =interpolate(normY, 0, viewer.clientHeight - glass.clientHeight);
	// determine paper position
	paperPos.tx = interpolate(normX, 0, diffX);
	paperPos.ty =interpolate(normY, 0, diffY);
	// determine magnified paper position
	glassBackPos.tx = interpolate(normX, 0, 100);
	glassBackPos.ty = interpolate(normY, 0, 100);
};

// handle stop touch
const touchend = () => {
	if (status !== STATUS_DRAG) return;
	status = STATUS_FADE;
	if (glass.classList.contains("active")) glass.classList.remove("active");
};

const magnify = (() => {})();

// listen to both touch and mouse
viewer.addEventListener("touchstart", touchstart);
viewer.addEventListener("touchmove", touchmove);
viewer.addEventListener("touchend", touchend);
viewer.addEventListener("touchcancel", touchend);
viewer.addEventListener("mousedown", touchstart);
viewer.addEventListener("mousemove", touchmove);
viewer.addEventListener("mouseup", touchend);

// run it every frame
(function tick() {
	// repeat
	requestAnimationFrame(tick);
	
	// nothing on idle
	if (status === STATUS_IDLE) return;
	
	// return to idle when smoothing out is at its end
	if (status === STATUS_FADE && Math.abs(glassPos.tx - glassPos.x) < 0.2) status = STATUS_IDLE;
	
	// smooth motion towards targets
	paperPos.x += smoothFactor * (paperPos.tx - paperPos.x);
	paperPos.y += smoothFactor * (paperPos.ty - paperPos.y);
	glassPos.x += smoothFactor * (glassPos.tx - glassPos.x);
	glassPos.y += smoothFactor * (glassPos.ty - glassPos.y);
	glassBackPos.x += smoothFactor * (glassBackPos.tx - glassBackPos.x);
	glassBackPos.y += smoothFactor * (glassBackPos.ty - glassBackPos.y);

	// transformations
	paper.style.transform = `translate(${-paperPos.x}px, ${-paperPos.y}px)`;
	glass.style.transform = `translate(${glassPos.x}px, ${glassPos.y}px)`;
	glass.style.backgroundPosition = `${glassBackPos.x}% ${glassBackPos.y}%`;
})();
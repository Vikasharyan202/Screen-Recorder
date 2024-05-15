setTimeout(() => {
	if (database) {
		// video retrievel
		let videoDBTransaction = database.transaction("video", "readonly");
		let videoStore = videoDBTransaction.objectStore("video");
		let videoRequest = videoStore.getAll();
		videoRequest.onsuccess = (e) => {
			let videoResult = videoRequest.result;
			let galleryContainer = document.querySelector(".gallery_container");
			videoResult.forEach((videoObj) => {
				let mediaElem = document.createElement("div");
				mediaElem.setAttribute("class", "media_container");
				mediaElem.setAttribute("id", videoObj.id);

				let url = URL.createObjectURL(videoObj.blobData);

				mediaElem.innerHTML = `
                <div class="media">
                    <video autoplay loop src="${url}"></video>
                </div>
                <div class="download action">Download</div>
                <div class="delete action">Delete</div>
                `;
				galleryContainer.appendChild(mediaElem);

				// Listeners
				let downloadBtn = mediaElem.querySelector(".download");
				downloadBtn.addEventListener("click", downloadListener);
				let deleteBtn = mediaElem.querySelector(".delete");
				deleteBtn.addEventListener("click", deleteListener);
			});
		};

		// image retrievel
		let imageDBTransaction = database.transaction("image", "readonly");
		let imageStore = imageDBTransaction.objectStore("image");
		let imageRequest = imageStore.getAll();
		imageRequest.onsuccess = (e) => {
			let imageResult = imageRequest.result;
			let galleryContainer = document.querySelector(".gallery_container");
			imageResult.forEach((imageObj) => {
				let mediaElem = document.createElement("div");
				mediaElem.setAttribute("class", "media_container");
				mediaElem.setAttribute("id", imageObj.id);

				let url = imageObj.imageData;

				mediaElem.innerHTML = `
                <div class="media">
                    <img src="${url}"/>
                </div>
                <div class="download action">Download</div>
                <div class="delete action">Delete</div>
                `;
				galleryContainer.appendChild(mediaElem);

				// Listeners
				let downloadBtn = mediaElem.querySelector(".download");
				downloadBtn.addEventListener("click", downloadListener);
				let deleteBtn = mediaElem.querySelector(".delete");
				deleteBtn.addEventListener("click", deleteListener);
			});
		};
	}
}, 100);

// UI, Database remmoval
function downloadListener(e) {
	let id = e.target.parentElement.getAttribute("id");
	let type = id.slice(0, 3);
	if (type == "vid") {
		let videoDBTransaction = database.transaction("video", "readwrite");
		let videoStore = videoDBTransaction.objectStore("video");
		let videoRequest = videoStore.get(id);
		videoRequest.onsuccess = (e) => {
			let videoResult = videoRequest.result;

			let videoURL = URL.createObjectURL(videoResult.blobData);

			let a  = document.createElement("a");
			a.href = videoURL;
			a.download = "video.mp4";
			a.click();
		};
	}else if(type === "img") {
        let imageDBTransaction = database.transaction("image", "readwrite");
		let imageStore = imageDBTransaction.objectStore("image");
		let imageRequest = imageStore.get(id);
		imageRequest.onsuccess = (e) => {
			let imageResult = imageRequest.result;

			let a  = document.createElement("a");
			a.href = imageResult.imageData;
			a.download = "image.jpg";
			a.click();
		};
    }
}

function deleteListener(e) {
	// Database remove
	let id = e.target.parentElement.getAttribute("id");
	let type = id.slice(0, 3);
	if (type === "vid") {
		let videoDBTransaction = database.transaction("video", "readwrite");
		let videoStore = videoDBTransaction.objectStore("video");
		videoStore.delete(id);
	} else if (type === "img") {
		let imageDBTransaction = database.transaction("image", "readwrite");
		let imageStore = imageDBTransaction.objectStore("image");
		imageStore.delete(id);
	}

	// UI remove
	e.target.parentElement.remove();
}

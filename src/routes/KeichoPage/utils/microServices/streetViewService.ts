

const goToStreetView = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const uid = queryParams.get('uid');
    const voicerec = queryParams.get('voicerec');
    const imgtak = queryParams.get('imgtak');

    const baseUrl = '/pc-mei-react';
    const targetUrl = `${baseUrl}/street-view?uid=${uid}&voicerec=${voicerec}&imgtak=${imgtak}`;

    window.location.replace(targetUrl);
}

export default goToStreetView;
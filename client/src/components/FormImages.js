import React from 'react';
import ImageGallery from 'react-image-gallery';

import "react-image-gallery/styles/css/image-gallery.css";
 
class FormImages extends React.Component {
  render() {
    if (!this.props.imageUrls) return <div />;
    const images = this.props.imageUrls.map(url => ({ original: url, thumbnail: url }));
    return <ImageGallery items={images} />
  }
}

export default FormImages;
import MapEditor from '../../components/MapEditor.svelte';

export default class MapWidget extends window.DecapCmsWidgetBase {
  constructor(props) {
    super(props);
    this.state = {
      latitude: props.value?.latitude || -14.235004,
      longitude: props.value?.longitude || -51.92528,
      zoom: props.value?.zoom || 4,
      geojson: props.value?.geojson || null,
    };
  }

  render() {
    const target = document.createElement('div');
    new MapEditor({
      target,
      props: {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        zoom: this.state.zoom,
      }
    });

    target.addEventListener('mapupdate', (event) => {
      this.setState(event.detail);
      this.props.onChange(event.detail);
    });

    return target;
  }
}

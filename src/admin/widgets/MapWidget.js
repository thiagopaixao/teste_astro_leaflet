import MapEditor from '../../components/MapEditor.svelte';

export const MapWidget = {
  name: 'map',
  component: MapEditor,
  props: ['value', 'onChange'],
  setup(props) {
    const handleMapUpdate = (event) => {
      props.onChange(event.detail);
    };

    return {
      handleMapUpdate,
    };
  },
};

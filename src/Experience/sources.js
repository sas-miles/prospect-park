export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/environmentMap/resting+place/nx.png',
        'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/environmentMap/resting+place/ny.png',
        'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/environmentMap/resting+place/nz.png',
        'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/environmentMap/resting+place/px.png',
        'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/environmentMap/resting+place/py.png',
        'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/environmentMap/resting+place/pz.png',
            
        ]
     },

    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/dirt/color.jpg'
    },

    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/dirt/normal.jpg'
    },

    {
        name: 'map',
        type: 'gltfModel',
        path: 'https://webflow-public-assets.s3.amazonaws.com/three-projects/prospect-park/models/prospect-test5.glb'
    },

    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'https://webflow-public-assets.s3.amazonaws.com/three-projects/starter-files/Fox.glb'
    },

    {
        name: 'cameraPath',
        type: 'file',
        path: 'https://webflow-public-assets.s3.amazonaws.com/three-projects/prospect-park/models/cam-track.json'
    }

]
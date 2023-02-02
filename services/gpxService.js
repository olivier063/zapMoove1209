import * as FileSystem from 'expo-file-system';


class GpxService {

    async createGpxFile(positions, fileName) {
        try {
            const gpx = `<?xml version="1.0" encoding="UTF-8"?>
          <gpx version="1.1" creator="My App">
            <trk>
              <trkseg>
                ${positions.map((p) => `
                  <trkpt lat="${p.latitude}" lon="${p.longitude}"></trkpt>
                `).join('')}
              </trkseg>
            </trk>
          </gpx>`;

            const fileUri = FileSystem.documentDirectory + fileName;

            await FileSystem.createFileAsync(fileUri, { overwrite: true });
            await FileSystem.writeAsStringAsync(fileUri, gpx);
            console.log(`File created at ${fileUri}`);
        } catch (error) {
            console.error(error);
        }
        console.log(gpx)

    }


    // Il est ensuite possible d'utiliser ce service dans d'autres parties 
    // de votre application en appelant gpxService.createGpxFile(positions, fileName) 
    // pour créer un fichier GPX.
   

    async createGPXFile(positions, timestamp) {
        let gpxData = '<?xml version="1.0" encoding="UTF-8"?>\n';
        gpxData += '<gpx version="1.1" creator="Expo" xmlns="http://www.topografix.com/GPX/1/1">\n';
        gpxData += '  <trk>\n';
        gpxData += '    <trkseg>\n';
        for (let i = 0; i < positions.length; i++) {
            gpxData += `      <trkpt lat="${positions[i].latitude}" lon="${positions[i].longitude}">\n`;
            gpxData += `        <time>${timestamp[i]}</time>\n`;
            gpxData += '      </trkpt>\n';
        }
        gpxData += '    </trkseg>\n';
        gpxData += '  </trk>\n';
        gpxData += '</gpx>';

        const fileUri = `${FileSystem.documentDirectory}track.gpx`;
        await writeAsStringAsync(fileUri, gpxData);
    }



}


const gpxService = new GpxService();
export default gpxService


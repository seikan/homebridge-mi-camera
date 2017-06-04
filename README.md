# homebridge-mi-camera

This is Xiaomi Mi Camera plugin for [Homebridge](https://github.com/nfarina/homebridge).

![mi-camera](https://cloud.githubusercontent.com/assets/73107/26754884/90d311da-48b5-11e7-872f-4a92886d3d04.jpg)

### Features

* Switch on / off. 


**Notes:** Only able to wake the camera from sleep or set it to sleep at this moment.




### Installation

1. Install required packages.

   ```
   npm install -g homebridge-mi-camera miio
   ```

   ​

2. Open Mi Home app and open Mi Camera from the device list.

3. Go to `Network Info` and find the IP address of the camera.

4. On your Homebridge server, open command prompt or terminal. Run following command to discover the device:

   ```
   miio --discover --sync
   ```

   **Notes:** This will take about a minute or two.

5. Wait until you get output below with the `Address` matches with the IP address you found from `Network Info`.

   ```
   Device ID: 50668318
   Model info: Unknown
   Address: 192.168.1.203
   Token: 3574645a6a52526447566b4e69484e42 via auto-token
   Support: Unknown
   ```

6. Record down the value value for `Token` as we need it later.

7. Add these values to `config.json`.

   ```
     "accessories": [
       {
         "accessory": "MiCamera",
         "name": "Mi Camera",
         "ip": "IP_ADDRESS_OF_THE_CAMERA",
         "token": "TOKEN_DISCOVERED_FROM_STEP_5",
       }
     ]
   ```

   ​

8. Restart Homebridge, and your Mi Camera will be added to Home app.



### License

See the [LICENSE](https://github.com/seikan/homebridge-mi-camera/blob/master/LICENSE.md) file for license rights and limitations (MIT).




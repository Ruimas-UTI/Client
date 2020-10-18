# qr-app



This repository contains the completed swiss qr code app including a mongodb dump.

## License
All code and any data in this repository is and will be licensed exclusively to Roth Advisory, Switzerland (see [License](LICENSE.md)).

## Setting up mongodb

1. Install version 3.6.8 of mongodb (future versions might use Mongodb versions > 4, but currently we are at 3.x)
2. To restore the `qrcode` database, open a shell and execute `mongorestore dump/qrcode`

## Using app

If you plan to use this app, then make sure that you first complete these setup instructions:

1. [Install the latest stable version of Node.js.](https://developers.shopify.com/tutorials/build-a-shopify-app-with-node-and-react/set-up-your-app#install-the-latest-stable-version)
2. Install npm packages (run: npm install).
3. [Expose your dev environment.](https://developers.shopify.com/tutorials/build-a-shopify-app-with-node-and-react/embed-your-app-in-shopify#expose-your-dev-environment)
4. [Get a Shopify API key and Shopify API secret key.](https://developers.shopify.com/tutorials/build-a-shopify-app-with-node-and-react/embed-your-app-in-shopify#get-a-shopify-api-key)
5. [Add the Shopify API key and Shopify API secret key.](https://developers.shopify.com/tutorials/build-a-shopify-app-with-node-and-react/embed-your-app-in-shopify#add-the-shopify-api-key)
6. Add `HOST='http://{your_forwarding_id}.ngrok.io'` 
7. Start your app (run: npm run dev).
8. [Authenticate and test your app.](https://developers.shopify.com/tutorials/build-a-shopify-app-with-node-and-react/embed-your-app-in-shopify#authenticate-and-test)
9. [Set up your app navigation.](https://developers.shopify.com/tutorials/build-a-shopify-app-with-node-and-react/build-your-user-interface-with-polaris#set-up-your-app-navigation)
10. [Add your ngrok url as Host.](https://developers.shopify.com/tutorials/build-a-shopify-app-with-node-and-react/charge-a-fee-using-the-billing-api#set-up)



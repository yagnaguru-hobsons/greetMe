var AWS = require("aws-sdk");
var s3Client = new AWS.S3({ apiVersion: '2006-03-01' });
const bucketName = "ygr";

    exports.handler = async (event) => {
        const body = JSON.parse(event.body);
        const longUrl = body.longUrl;
        if( !longUrl || longUrl === ""){
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"message":"URL cannot be empty"})
            };
        }
        let enc = Math.random().toString(36).substr(2, 5);
        let params1 = { 
            Bucket: bucketName, 
            Key: enc, 
            ACL:'public-read',
            WebsiteRedirectLocation:longUrl 
        };
        try {
            let obj = await createObject(params1);
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"message":`http://ygr.s3-website-us-east-1.amazonaws.com/${enc}`})
            };
        }
        catch (err) {
            console.log(err)
        }
    }

    async function createObject(params1) {
        return new Promise(async (resolve, reject) => {
            await s3Client.putObject(params1, function (err, data) {
                if (err) {
                    console.log('Error creating the folder:', err);
                    reject('error during putObject');
                } else {
                    console.log('success' + JSON.stringify(data));
                    resolve('success');
                }
            });
        });
    }

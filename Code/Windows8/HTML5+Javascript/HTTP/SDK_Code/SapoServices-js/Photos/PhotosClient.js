(function () {
    WinJS.Namespace.define("Photos", {
        ServiceClient: WinJS.Class.define(
            function (username, password, accessKey) {

                if (!(username && password && accessKey))
                    throw "MUST provide username, password and accessKey";
                this.username = username;
                this.password = password;
                this.accessKey = accessKey;
                this.photosBaseUri = "https://services.sapo.pt/Photos/";
            },
            {
                asyncDummyEcho: function (params) {
                    var dummyEchoAllowedParams = ["echoStr", "json", "ESBUsername", "ESBPassword"];
                    if (params) {

                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(Utils.buildUri(this.photosBaseUri, params,
                                dummyEchoAllowedParams, "DummyEcho"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        return WinJS.xhr({ type: "GET", url: uri, headers: headers })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify parameters";
                },

                asyncImageCreate: function (file, image) {
                    var imageCreateAllowedParams = ["json", "ESBUsername", "ESBPassword"];
                    var imageToBeSerialized = {};
                    imageToBeSerialized.image = image;

                    var imageStr = JSON.stringify(imageToBeSerialized);

                    var params = {};

                    params.json = "true";
                    params.ESBUsername = this.username;
                    params.ESBPassword = this.password;
                    var uri =
                        Windows.Foundation.Uri(Utils.buildUri(this.photosBaseUri, params,
                            imageCreateAllowedParams, "ImageCreate"))
                        .absoluteCanonicalUri;

                    var headers = {};

                    headers["Content-Type"] = "application/json";
                    headers["Authorization"] = "ESB AccessKey=" + this.accessKey;

                    return WinJS.xhr({ type: "POST", url: uri, headers: headers, data: imageStr })
                        .then(function (xhr) {
                            if (xhr.status == 200 && xhr.responseText)
                                return xhr.responseText;
                            return null;
                        })
                        .then(function (responseText) {
                            if (responseText == null)
                                return null;
                            var response = JSON.parse(responseText);

                            var imageCreateResponse = response.ImageCreateResponse.ImageCreateResult;

                            var uploadPhotoUri = new Windows.Foundation.Uri("http://fotos.sapo.pt/uploadPost.html");

                            var uploader = new Windows.Networking.BackgroundTransfer.BackgroundUploader();

                            var parts = [];

                            var tokenPart = new Windows.Networking.BackgroundTransfer.BackgroundTransferContentPart("token");
                            tokenPart.setText(imageCreateResponse.token);
                            parts.push(tokenPart);

                            var photoPart = new Windows.Networking.BackgroundTransfer.BackgroundTransferContentPart("photo", file.name);
                            photoPart.setFile(file);
                            photoPart.setHeader("Content-Type", file.contentType);
                            parts.push(photoPart);

                            return uploader.createUploadAsync(uploadPhotoUri, parts, "form-data", "imgboundary")
                                .then(function (uploadOperation) {
                                    return uploadOperation.startAsync();
                                })
                                .then(function (uploadOperation) {
                                    var responseInformation = uploadOperation.getResponseInformation();

                                    var contentLenght = responseInformation.headers["Content-Length"];

                                    var inputStream = uploadOperation.getResultStreamAt(0);

                                    var reader = new Windows.Storage.Streams.DataReader(inputStream);

                                    return reader.loadAsync(contentLenght).then(function () {
                                        var resultText = reader.readString(contentLenght);

                                        var xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();

                                        xmlDocument.loadXml(resultText);
                                        var resultTag = xmlDocument.getElementsByTagName("Result");

                                        return resultTag[0].innerText;
                                    });
                                });

                        });
                },

                asyncImageDetails: function (uid) {
                    var imageDetailsAllowedParams = ["uid", "json", "ESBUsername", "ESBPassword"];
                    if (uid) {
                        var params = {};
                        params.uid = uid;
                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(Utils.buildUri(this.photosBaseUri, params, imageDetailsAllowedParams, "ImageDetails"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        return WinJS.xhr({ type: "GET", url: uri, headers: headers })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify parameters";
                },

                asyncImageGetListBySearch: function (params) {
                    var imageGetListBySearchAllowedParams =
                    ["string", "page", "interface", "datefrom", "dateto", "json", "ESBUsername", "ESBPassword"];
                    if (params) {

                        //Convert dates to Strings
                        if (params.datefrom)
                            params.datefrom = Utils.dateToString(params.datefrom);
                        if (params.dateto)
                            params.dateto = Utils.dateToString(params.dateto);

                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(Utils.buildUri(this.photosBaseUri, params,
                                imageGetListBySearchAllowedParams, "ImageGetListBySearch"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        return WinJS.xhr({ type: "GET", url: uri, headers: headers })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify parameters";
                },

                asyncImageGetListByTags: function (params) {
                    var imageGetListByTagsAllowedParams =
                    ["tag", "page", "orderby", "m18", "username", "interface", "json", "ESBUsername", "ESBPassword"];
                    if (params) {

                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(Utils.buildUri(this.photosBaseUri, params,
                                imageGetListByTagsAllowedParams, "ImageGetListByTags"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        return WinJS.xhr({ type: "GET", url: uri, headers: headers })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });

                    }
                    throw "MUST specify parameters";
                },

                asyncImageDelete: function (uid) {
                    var imageDeleteAllowedParams = ["uid", "json", "ESBUsername", "ESBPassword"];
                    if (uid) {
                        var params = {};
                        params.uid = uid;
                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(Utils.buildUri(this.photosBaseUri, params,
                                imageDeleteAllowedParams, "ImageDelete"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        return WinJS.xhr({ type: "GET", url: uri, headers: headers })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify uid parameter";
                },

                asyncImageGetListByUser: function (user) {
                    var imageGetListByUserAllowedParams = ["username", "json", "ESBUsername", "ESBPassword"];
                    if (user) {
                        var params = {};
                        params.username = user;
                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(Utils.buildUri(this.photosBaseUri, params,
                                imageGetListByUserAllowedParams, "ImageGetListByUser"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        return WinJS.xhr({ type: "GET", url: uri, headers: headers })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify username parameter";
                },

                asyncimageGetListByUserAlbum: function (albumid, params) {
                    var imageGetListByUserAlbumAllowedParams = ["page", "orderby", "id", "username", "json",
                        "ESBUsername", "ESBPassword"];
                    if (albumid) {

                        if (!params)
                            params = {};
                        params.id = albumid;
                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(
                                Utils.buildUri(this.photosBaseUri, params,
                                    imageGetListByUserAlbumAllowedParams, "ImageGetListByUserAlbum"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        return WinJS.xhr({ type: "GET", url: uri, headers: headers })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify album id parameter";
                },

                asyncImageAddToAlbum: function (imageuid, albumids) {
                    var imageAddToAlbumAllowedParams = ["imageuid", "albumid", "json", "ESBUsername", "ESBPassword"];
                    if (albumids != undefined && imageuid != undefined) {

                        var params = {};
                        params.imageuid = imageuid;
                        params.albumid = albumids;
                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(
                                Utils.buildUri(this.photosBaseUri, params,
                                    imageAddToAlbumAllowedParams, "ImageAddToAlbum"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        return WinJS.xhr({ type: "GET", url: uri, headers: headers })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify album ids and image uid parameters";
                },

                asyncAlbumCreate: function (album) {
                    var albumCreateAllowedParams = ["json", "ESBUsername", "ESBPassword"];
                    if (album) {
                        var albumToBeSerialized = {};
                        albumToBeSerialized.album = album;

                        var albumStr = JSON.stringify(albumToBeSerialized);

                        var params = {};
                        params.json = "true";
                        params.ESBUsername = this.username;
                        params.ESBPassword = this.password;
                        var uri =
                            Windows.Foundation.Uri(
                                Utils.buildUri(this.photosBaseUri, params, albumCreateAllowedParams, "AlbumCreate"))
                            .absoluteCanonicalUri;

                        var headers = {};
                        headers["Authorization"] = "ESB AccessKey=" + this.accessKey;
                        headers["Content-Type"] = "application/json";
                        return WinJS.xhr({ type: "POST", url: uri, headers: headers, data: albumStr })
                            .then(function (xhr) {
                                if (xhr.status == 200 && xhr.responseText)
                                    return xhr.responseText;
                                return null;
                            });
                    }
                    throw "MUST specify album object";
                }
            }
        )
    });

})();
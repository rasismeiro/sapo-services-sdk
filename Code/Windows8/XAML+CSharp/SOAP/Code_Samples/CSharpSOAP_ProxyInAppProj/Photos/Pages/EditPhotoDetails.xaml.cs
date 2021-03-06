﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Photos.Common;
using Photos.SapoServices;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Image = Photos.PhotosServiceReference.Image;

// The Basic Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234237

namespace Photos.Pages
{
    /// <summary>
    /// A basic page that provides characteristics common to most applications.
    /// </summary>
    public sealed partial class EditPhotoDetails : Photos.Common.LayoutAwarePage
    {
        public EditPhotoDetails()
        {
            this.InitializeComponent();
        }

        /// <summary>
        /// Populates the page with content passed during navigation.  Any saved state is also
        /// provided when recreating a page from a prior session.
        /// </summary>
        /// <param name="navigationParameter">The parameter value passed to
        /// <see cref="Frame.Navigate(Type, Object)"/> when this page was initially requested.
        /// </param>
        /// <param name="pageState">A dictionary of state preserved by this page during an earlier
        /// session.  This will be null the first time a page is visited.</param>
        protected override void LoadState(Object navigationParameter, Dictionary<String, Object> pageState)
        {
        }

        /// <summary>
        /// Preserves state associated with this page in case the application is suspended or the
        /// page is discarded from the navigation cache.  Values must conform to the serialization
        /// requirements of <see cref="SuspensionManager.SessionState"/>.
        /// </summary>
        /// <param name="pageState">An empty dictionary to be populated with serializable state.</param>
        protected override void SaveState(Dictionary<String, Object> pageState)
        {
        }

        private async void BtGetPhotoClick(object sender, RoutedEventArgs e)
        {
            App app = Application.Current as App;

            if (app == null)
                return;

            var client = new PhotosServiceClient(app.EsbUsername, app.EsbPassword, app.EsbAccessKey);

            Image img = new Image
            {
                uid = this.tb_PhotoUidForEditPhoto.Text,
                title = this.tb_PhotoTitleForGetPhoto.Text,
                tags = this.tb_PhotoTagsForGetPhoto.Text,
                synopse = this.tb_PhotoSynopseForGetPhoto.Text
            };

            Image returnedImage = await client.EditImageDetailsAsync(img);

            if (returnedImage != null)
                tblock_Result.Text = 
                    String.Format("Uri: {0}; tags: {1}; title: {2}; synopse: {3}",
                        img.uid, 
                        img.tags, 
                        img.title,
                        img.synopse);
        }
    }
}

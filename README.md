What is pyCHIP?
==================

pyCHIP is a tool for image segmentation and feature classification in transmission electron microscopy (TEM) images based on a small support set of user-provided examples. It is based on a few-shot machine learning approach, which can classify a variety of microstructural features from limited examples.

pyCHIP is most useful for trained microscopists who would like to identify features in their TEM images, where such an analysis would ordinarily be tedious or time-consuming by hand.

This code is the result of a project for the University of Washington Data Intensive Research Enabling Clean Technologies (UW-DIRECT) capstone program. For more information on the program, visit: https://depts.washington.edu/uwdirect/

How to Use pyCHIP
-------------

pyCHIP usage occurs into four steps: Data Import, Grid Selection and Chipping, Support Set Selection, and Classification Display. **This release of the code does not include the proprietary few-shot module needed to process data, but does include all other GUI elements. More details are given in the associated manuscript.**

Begin by clicking on Analyze and Predict in the menu on the left.

![](prototype/static/images/overview.png)

Data Import
-------------

In this step, the user selects data to be processed. Currently allowed data formats are jpg, png, tiff, and dm4. The first three are common image formats, while the last is a proprietary container format used by the Gatan Microscopy Suite, an industry-standard TEM analysis application. Images should be imported without any visible scale bar or other annotation. If no image is uploaded before submitting, an error message indicates that no appropriate file was selected. While in principle any image resolution can be used, the processing time does increase significantly with larger resolution. For best performance, it is recommended to downsample large images to resolution of 512 x 512 or 1024 x 1024 pixels. However, it is important to avoid aliasing artifacts, which can occur in high-resolution micrographs, particularly those containing lattice features.

Grid Selection and Chipping
-------------

Now the user must perform the important task of grid size selection and image chipping. Put simply, the user selects an appropriate sampling grid relative to their features of interest, which is used to chip the image in the backend few-shot code. To aid in this process, the user can drag a slider bar to dynamically adjust a superimposed grid atop their image. An ideal support set for the few-shot pyCHIP model is built from a grid with each square containing a unique microstructural feature or motif. The range of allowed grid sizes is dynamic, scaling from a minimum 50 pixels up to the dimensions of the uploaded image. The default lower limit is set to 50 pixels for visibility, but can be as small as the single pixel level. Too coarse a grid size will not capture relevant features, while too fine a grid will greatly increase processing time, so the user should test different sizes to strike an optimal balance. Once an appropriate size is determined, the user clicks the "Use This Grid Size" button and the desired grid size is passed to a function that crops the edges of the full size image to the total mesh, sub-divides the image, and saves the resulting collection of support set "chips." Both the raw chips and support sets are saved for future recall.

Support Set Selection
-------------

After chipping, the user must assign support set examples as features of interest. Building on the concept of the ubiquitous CAPTCHA (Completely Automated Public Turing test to tell Computers and Humans Apart) security feature on websites, we have designed an intuitive interface for labeling. The chips created in the previous step now appear on the dashboard as interactive objects. The user is provided with an empty starting support set in a drop-down menu, which can be renamed. This menu controls the specific support set(s) that is/are available for modification. Any image chips that the user clicks on will be added to the currently staged support set and appear in the right panel. These selected chips will appear highlighted in colors based on the user-designated support set. In cases where the user clicks the wrong chip and would like to remove it from the support set, they may click the highlighted chip again. Additional support sets can be added or removed by clicking the appropriate buttons at the top of the panel. In practice, the user is is advised to assign a minimum of 2 chips or maximum of 10 chips to each labeled set. These chips should be selected from different parts of the image to capture some of the variability in the data. Since the selected chips will become the support set for the few-shot ML model, all suspected feature types should be selected—sets can easily be adjusted by reprocessing. After the chip selection and labeling, the user may click "Save Support Set & Process" to update the training set and begin training the model. The trained model will then predict features against the selected support sets.

Classification Display
-------------

After training the model using the selected chips, the model predicts the support set label for all the chips in the original image and returns a colorized segmented image. The right side presents the count for each user-selected support set within the image. The segmented image and associated statistics tell the user critical information regarding features in the image. The user can export the colorized image (png format), the bar chart (png or svg formats), and the raw data for the bar chart (csv format).

Installation
======================

Download Git Repository
-------------
    cd <replace with location of project folder>
    git clone https://github.com/pnnl/pychip_gui.git
    cd pychip_gui


Create environment
-------------

    #if have Mac:

    python3 -m venv env
    source env/bin/activate


    #if have Windows:

    virtualenv env
    \path\to\env\Scripts\activate

Install required packages
-------------
    cd prototype
    pip install -r requirements.txt


Run App
-------------
    python app.py

    - go to http://127.0.0.1:5000/

Relaunch
------

    cd to pychip_gui
    git pull

    #reactivate environment
    source env/bin/activate #if have mac
    \path\to\env\Scripts\activate #if have windows


    cd to prototype folder
    python app.py

    - For ease of use a demo video has been included in the repository under /docs/videos/UIDemo
    - Additional Instructions have been included in the Prototype app.

 How to Cite pyCHIP
 ======================

 If you find this application useful and want to publish your results, please cite our preprints:

 • Sarah Akers, Elizabeth Kautz, Andrea Trevino-Gavito et al. Rapid and Flexible Semantic Segmentation of Electron Microscopy Data Using Few-Shot Machine Learning, 19 March 2021, PREPRINT (Version 1) available at Research Square [https://doi.org/10.21203/rs.3.rs-346102/v1]

 • Christina Doty, Shaun Gallagher, Wenqi Cui, Wenya Chen, Shweta Bhushan, Marjolein Oostrom, Sarah Akers, Steven R. Spurgeon. Design of a Graphical User Interface for Few-Shot Machine Learning Classification of Electron Microscopy Data, 2021 Arxiv Preprint [https://arxiv.org/abs/2107.10387]

 Contact Information
 ======================

 For questions about pyCHIP usage or the few-shot machine learning approach, contact Steven Spurgeon (steven.spurgeon@pnnl.gov).

 Team Members
-------------

 University of Washington DIRECT Capstone Program Students: Christina Doty, Shaun Gallagher, Wenqi Cui, Shweta Bhushan and Wenya Chen

 Pacific Northwest National Laboratory: Sarah Akers, Marjolein T. Oostrom and Steven R. Spurgeon

Acknowledgments
======================

The authors would like to thank Drs. Jenna Pope, Elizabeth Kautz, and Matthew Olszta for reviewing the code and related manuscript. This research was supported by the I3T Commercialization Laboratory Directed Research and Development (LDRD) program at Pacific Northwest National Laboratory (PNNL). PNNL is a multiprogram national laboratory operated for the U.S. Department of Energy (DOE) by Battelle Memorial Institute under Contract No. DE-AC05-76RL0-1830. Experimental sample preparation was performed at the Environmental Molecular Sciences Laboratory (EMSL), a national scientific user facility sponsored by the Department of Energy's Office of Biological and Environmental Research and located at PNNL. TEM data was collected in the Radiological Microscopy Suite (RMS), located in the Radiochemical Processing Laboratory (RPL) at PNNL. C.D.,S.G., W.C., W.Q. and S.B. acknowledge support from the University of Washington Clean Energy Institute and the National Science Foundation Research Traineeship under Award NSF DGE-1633216.

Usage License
======================
Copyright Battelle Memorial Institute

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. This material was prepared as an account of work sponsored by an agency of the United States Government. Neither the United States Government nor the United States Department of Energy, nor Battelle, nor any of their employees, nor any jurisdiction or organization that has cooperated in the development of these materials, makes any warranty, express or implied, or assumes any legal liability or responsibility for the accuracy, completeness, or usefulness or any information, apparatus, product, software, or process disclosed, or represents that its use would not infringe privately owned rights.

Reference herein to any specific commercial product, process, or service by trade name, trademark, manufacturer, or otherwise does not necessarily constitute or imply its endorsement, recommendation, or favoring by the United States Government or any agency thereof, or Battelle Memorial Institute. The views and opinions of authors expressed herein do not necessarily state or reflect those of the United States Government or any agency thereof.

PACIFIC NORTHWEST NATIONAL LABORATORY operated by BATTELLE for the UNITED STATES DEPARTMENT OF ENERGY under Contract DE-AC05-76RL01830

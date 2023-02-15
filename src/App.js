import AOS from "aos";
import { useState, useEffect } from "react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import contractAbi from "./Abis/astrobabies.json";

AOS.init();

const App = () => {
  let [ChainId, setChainId] = useState();
  let [account, setAccount] = useState();
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();
  const contractAddress = "0x86eEcaeFB5BdEedAb0484A8d27Db4D024166557E";
  let [counter, setCounter] = useState(1);
  const [connected, setConnected] = useState(false);
  let [mintPriceState, setMintPrice] = useState();

  const plus = () => {
    if (counter < 8800) setCounter(counter + 1);
  };

  const minus = () => {
    if (counter > 1) setCounter(counter - 1);
  };

  // WEB3 FUNCTIONS

  const data = async (provider) => {
    const newWeb3 = new Web3(provider);
    setProvider(newWeb3);
    const cId = await newWeb3.eth.getChainId();
    setChainId((ChainId = cId));
    console.log(ChainId);
    if (ChainId === 4 || ChainId === 1) {
      loadContract();
      const accounts = await newWeb3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(accounts[0]);
      setConnected(true)
    } else {
      alert("Please change chain to Ethereum Network");
    }
  };

  const loadContract = () => {
    window.web3 = new Web3(window.ethereum);
    const web3 = window.web3;
    const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);
    setContract(contract);
    console.log(contract);
  };

  useEffect(() => {
    try {
      loadContract();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const loadWeb3 = async () => {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
              1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            },
            chainId: [4, 1],
          },
        },
      };

      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        disableInjectedProvider: false,
      });
      const preProvider = await web3Modal.connect();
      window.ethereum.on("chainChanged", async (chainId) => {
        if (chainId === "0x4" || chainId === "0x1") {
          loadContract();
        } else {
          alert("Please change chain to Rinkeby || Ethereum Network");
        }
      });
      window.ethereum.on("accountsChanged", async (accounts) => {
        setAccount((account = accounts[0]));
      });
      await web3Modal.toggleModal();
      data(preProvider).then((r) => { });
    } catch (e) {
      console.log(e);
    }
  };

  const Mint = async () => {
    if (account) {
      console.log("function is calling");
      try {
        contract.methods
          .getMintPrice()
          .call(function (err, res) {
            if (err) {
              console.log("An error occured", err);
              return;
            } else {
              setMintPrice((mintPriceState = provider.utils.fromWei(`${res}`)));
              console.log(res);
            }
          })
          .then(() => {
            console.log(mintPriceState);
            contract.methods
              .mint(counter)
              .send({
                from: account,
                value: provider.utils.toWei(
                  (mintPriceState * counter).toString(),
                  "ether"
                ),
              })
              .then(() => {
                alert("Minting Successful");
              })
              .catch((e) => {
                console.log(e);
              });
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <section className="navigation fixed-top">
        <div className="container-fluid px-md-4 d-flex justify-content-between align-items-center">
          <div className="navLogo w-100 d-flex justify-content-center justify-content-md-start ps-md-5">
            <img
              src={require("./assets/images/logo.png")}
              className="myLogo ms-md-4"
              alt=""
            />
          </div>

          <div className="navLinks d-none d-md-flex">
            <ul className="navUl">
              <li>
                <a href="#"></a>
              </li>
              <li>
                <a href="#"></a>
              </li>
              <li>
                <a href="#"></a>
              </li>
              <li>
                <a href="https://twitter.com/AstrobabyNFT">
                  <i class="fa-brands fa-twitter navTwitter"></i>
                </a>
              </li>
              <li>
                <a href="https://discord.com/invite/DgyM3WyW6w">
                  <i class="fa-brands fa-discord navTwitter"></i>
                </a>
              </li>

              <li>

                <a href="https://www.instagram.com/astrobabynft/">
                  <img src={require("./assets/images/insta.png")} class="instaImg" alt="" />


                </a>
              </li>
            </ul>

            <div className="connectView">
              <button
                onClick={() => {
                  loadWeb3();
                }}
                className="connectBtn"
                style={{ whiteSpace: "nowrap" }}
              >
                {connected ? `${account.substring(0, 4)}...${account.substring(account.length - 3, account.length)}` : "CONNECT WALLET"}
              </button>
            </div>

          </div>



          {/* <button className="ms-md-4 connectBtn">CONNECT WALLET</button> */}
        </div>
        <div className="d-flex justify-content-center d-md-none">
          <button
            onClick={() => {
              loadWeb3();
            }}
            className="connectBtnOne"
          >
            {connected ? `${account.substring(0, 4)}...${account.substring(account.length - 3, account.length)}` : "WALLET CONNECT"}
          </button>
        </div>
      </section>

      <section className="banner  ">
        <img
          src={require("./assets/images/bg.jpg")}
          className="img-fluid"
          alt=""
        />
      </section>

      <section className="bannerBottom d-flex flex-column">
        <div
          className="container d-flex flex-column align-items-center"
         
        >
          <p className="cartonicPara mb-1">
            ☾ ⋆8,880 pixel magical beings bridging astrology & wellness with web3 technology⋆ ☽‍
          </p>
          {/* <p className="cartonicPara">
            Astrolist mint: Tue, 16 Aug 3:30 - 4:30 PM (GMT 0)
          </p> */}
          <p className="cartonicPara pt-3">
            
          </p>
        </div>

        <div className="container">


          <div className="counterDiv"
          >
            <div className="  d-flex justify-content-center align-items-center">
              <div className="flexRow newCounter me-1">
                <div className="minus" onClick={minus}>
                  <i class="fa-solid fa-minus"></i>
                </div>


                <div className="count">

                  <span className="headingOne">{counter}</span>
                </div>
                <div className="plus" onClick={plus}>
                  <i class="fa-solid fa-plus"></i>
                </div>
              </div>

              <button onClick={() => {
                Mint()
              }}
                className="mintBtn ms-3">
                &#9825; MINT &#9825;
              </button>

            </div>
            <p className="headingOne text-center small mt-4"> <i>MAKE SURE YOU HAVE ENOUGH ETH (0.04ETH) IN YOUR WALLET BEFORE MINTING</i></p>
                        <p className="headingOne text-center small mt-4"> <i>TO PREVENT AN HIGH GAS FEE ERROR</i></p>
            <p className="headingOne text-center small mt-4"> <i>PRICE: 0.04ETH MAX | PER WALLET: *Unlimited*</i></p>
          </div>
        </div>
      </section>


      {/* <section className="items">
        <div
          data-aos="fade-left"
          data-aos-offset="200"
          data-aos-delay="1000"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
        >
          <ul className="imagesListOne">
            <li>
              <img
                src={require("./assets/images/item1.jpeg")}
                className="listImg"
                alt=""
              />
            </li>
            <li>
              <img
                src={require("./assets/images/item2.jpeg")}
                className="listImg"
                alt=""
              />
            </li>
            <li>
              <img
                src={require("./assets/images/item4.jpeg")}
                className="listImg"
                alt=""
              />
            </li>
            <li>
              <img
                src={require("./assets/images/item5.png")}
                className="listImg"
                alt=""
              />
            </li>
            <li>
              <img
                src={require("./assets/images/item6.png")}
                className="listImg"
                alt=""
              />
            </li>
            <li>
              <img
                src={require("./assets/images/item7.png")}
                className="listImg"
                alt=""
              />
            </li>
            <li>
              <img
                src={require("./assets/images/item8.jpeg")}
                className="listImg"
                alt=""
              />
            </li>
            <li>
              <img
                src={require("./assets/images/item11.jpeg")}
                className="listImg"
                alt=""
              />
            </li>
          </ul>
        </div>

        <div className="mt-3" data-aos="fade-right" data-aos-duration="1300">
          <ul className="imagesListOne">
            <li>
              <img
                src={require("./assets/images/bottom4.png")}
                className="listImg"
                alt=""
              />
            </li>

            <li>
              <img
                src={require("./assets/images/item13.png")}
                className="listImg"
                alt=""
              />
            </li>

            <li>
              <img
                src={require("./assets/images/item17.png")}
                className="listImg"
                alt=""
              />
            </li>

            <li>
              <img
                src={require("./assets/images/item16.png")}
                className="listImg"
                alt=""
              />
            </li>
            <li>
              <img
                src={require("./assets/images/item21.png")}
                className="listImg"
                alt=""
              />
            </li>

            <li>
              <img
                src={require("./assets/images/item20.jpeg")}
                className="listImg"
                alt=""
              />
            </li>

            <li>
              <img
                src={require("./assets/images/item18.png")}
                className="listImg"
                alt=""
              />
            </li>

            <li>
              <img
                src={require("./assets/images/item22.png")}
                className="listImg"
                alt=""
              />
            </li>
          </ul>
        </div>
      </section>

      <section className="content" id="origin">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div >
                <h2 className="cartonicHeading">THE ORIGIN OF ASTROBABIES</h2>
              </div>
              <div >
                <p className="cartonicPara cartonicParaOne">
                  Astrobabies are the carefree and content creatures living on
                  the Jalajubee planet, where astrology magic and blockchain
                  technology meet on the other side of your monitor screen. They
                  are empowered by their astrological guidance and know-how
                  <i>
                    (well, sometimes they like to go on co-star to seek a second
                    opinion)
                  </i>
                  .
                </p>

                <p className="cartonicPara cartonicParaOne mt-4">
                  Once upon a time, the evil wizard Woozeeywoby was jealous of
                  the love and friendship that human beings shared. He
                  determined to infiltrate every inch of purity by sending his
                  underlings to torment humanity: vanity, self-doubt, obsession,
                  and the monster created by his very own, jealousy, to haunt
                  people on the internet.
                </p>
              </div>

              <div >
                <p className="cartonicPara cartonicParaOne">
                  As more and more innocent souls fell under his paw, the
                  Astrobaby council decided to share their superpower with human
                  beings. When 12 Astrobabies of different astrological signs
                  united, they can unleash their ultimate kill.
                </p>

                <p className="cartonicPara cartonicParaOne mt-4 bold6">
                  “Beepbopbadooooo!!!!!!”
                </p>

                <p className="cartonicPara cartonicParaOne">
                  A beam of dazzling purple light reached higher and higher into
                  the vault of heaven. Suddenly, a giant flying piggie
                  manifested <b> ଘ|˵ ͠° (oo) °͠ ˵</b>. The flying piggie swiftly
                  shuffled among the dark clouds as it cries ominously.
                </p>

                <p className="cartonicPara cartonicParaOne mt-4 bold6">
                  "HONK... HONK!"
                </p>

                <p className="cartonicPara cartonicParaOne">
                  The piggie fired a laser rainbow from its eyes to the
                  Woozeeywoby army and turned them all into SKITTLES. After
                  realizing his power crumbled, the wicked wizard fled.
                </p>

                <p className="cartonicPara cartonicParaOne">
                  To keep Woozeeywoby and his power out of the earth,
                  Astrobabies decide to grant people the astrological magic and
                  live with humans happily ever since.
                </p>
              </div>

              <div className="imageOne">
                <img
                  src={require("./assets/images/cartoons.png")}
                  className="w-100"
                  alt=""
                />
              </div>

              <h2 className="cartonicHeading mt-5">
                A COMMUNITY FOCUSED ASTROLOGY PROJECT
              </h2>

              <p className="cartonicPara cartonicParaOne mt-4">
                Alongside our Astrobabies, we are dedicated to creating the best
                astrology NFT community where friendship, love, and creativity
                can grow. We are here to nurture a friendly and rewarding
                e-space. That's why:
              </p>

              <p className="cartonicPara cartonicParaOne mt-4">
                <b> <i>
                  * Our public mint price is 0.02 ETH. <br /> * 20% of the
                  initial sale revenue will stay in our community wallet for
                  supporting emerging NFT artists & Astrology content creators.
                  <br />* In return, our holders can acquire both premium
                  astrology wellness content, and first-hand Allowlist access to
                  selected upcoming NFT projects. <br /> * We offer emotional
                  and mental health support whenever you need us. 💟
                </i> </b>
              </p>

              <h2 className="cartonicHeading mt5" id="roadmap">
                ROADMAP
              </h2>
              <p className="cartonicPara cartonicParaOne">
                When will Astrobabies embark on their great journey? Here are
                the answers!
              </p>
            </div>

            <div className="col-md-7">
              <div className="cardSection">
                <div className="customCard cardOne">
                  <h1 className="cartonicHeading headingBordered">PHASE 1</h1>
                  <h4 className="cartonicHeading mt-5">MAY 2022 - ASTROLIST</h4>
                  <p className="cartonicParaOne mt-4 mb-0 font3">
                    Time to make new friendz!
                  </p>
                  <p className="cartonicParaOne font3">
                    Our 
                      Astrolist
                       has 2,500 available free mint spots for the
                    presale of 1,110 NFTs. We give Astrolist spots to active
                    members in <a href="https://discord.com/invite/DgyM3WyW6w" className="link">
                      <i>discord</i>
                    </a> or the ones who interact with us on{" "}
                    <a href="#" className="link">
                      <i>Twitter</i>
                    </a>
                  </p>
                  <p className="mt-5">
                    <b>ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚</b>
                  </p>
                </div>

                <div className="customCard cardOne">
                  <h1 className="cartonicHeading headingBordered">PHASE 2</h1>
                  <h4 className="cartonicHeading mt-5">
                    AUG 2022 - PRESALE + PUBLIC SALE
                  </h4>
      
                  <p className="mt-4  mb-1 ">
                    <b>Astrolist mint</b>
                  </p>
                  <p className="cartonicParaOnefont3 mb-1 font3">
                    Time: Tue, 16 Aug 2022 3:30 PM (GMT 0)
                  </p>
                  <p className="cartonicParaOnefont3 mb-1 font3">
                    Duration: 60 minutes
                  </p>
                  <p className="cartonicParaOnefont3 mb-1 font3">
                    Price: free mint + gas
                  </p>
                  <p className="cartonicParaOnefont3 mb-1 font3">
                    Availability: 2,500 Astrolist spots for 1,110 NFTs
                  </p>

                  <p className="mt-4  mb-1 ">
                    <b>Public mint</b>
                  </p>
                  <p className="cartonicParaOnefont3 mb-1 font3">
                    Time: Tue, 16 Aug 2022 3:30 PM (GMT 0)
                    <br />
                    Duration: until sold out
                    <br />
                    Price: 0.02 ETH + gas
                    <br />
                    Availability: 7,770
                    <br />
                  </p>
                </div>

                <div className="customCard cardOne">
                  <h1 className="cartonicHeading headingBordered">PHASE 3</h1>
                  <h4 className="cartonicHeading mt-5">
                    SEPT 2022 - SUPERNOVA PROJECT
                  </h4>
                  <p className="cartonicParaOne mt-4 mb-0 font3"></p>
                  <p className="cartonicParaOne font3">
                    To support emerging NFT artists and benefit our holders. We
                    will make financial and mentorship investments in new
                    artists or projects that we see great potential.In return,
                    our holders will get Allowlist spots or even free NFTs from
                    these upcoming projects. ‍
                  </p>
                  <p className="mt-5">
                    <b>٩( ´︶` )( ´︶` )۶</b>
                  </p>
                </div>

                <div className="customCard cardOne">
                  <h1 className="cartonicHeading headingBordered">PHASE 4</h1>
                  <h4 className="cartonicHeading mt-5">
                    OCT 2022 - ASTROBABY COMMUNITY MOVE
                  </h4>
                  <p className="cartonicParaOne mt-4 mb-0 font3"></p>
                  <p className="cartonicParaOne font3">
                    To support the astrology & wellness community, we will
                    invite related content creators to host community
                    activations. It will include live stream full moon
                    ceremonies, art journey sessions, astrology broadcasts, etc.
                  </p>

                  <p className="cartonicParaOne font3">
                    An Astrobaby NFT also grant your discounted access to our
                    online boutique, where you can find dangerously adorable
                    Astrobaby merch & hand-picked wellness products.
                  </p>

                  <p className="cartonicParaOne font3">
                    We are here to help our community thrive and grow in a
                    sustainable and healthy way!
                  </p>
                  <p className="cartonicParaOnefont3 mb-1 font3">
                    <br /> 20% of the initial public sale revenue will go to our
                    community wallet for community building.{" "}
                    <b>Beepbopbadooooo!!!!!!</b>
                  </p>

                  <p className="mt-5">
                    <b>ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚</b>
                  </p>
                </div>

                <div className="customCard cardOne">
                  <h1 className="cartonicHeading headingBordered">PHASE 5</h1>
                  <h4 className="cartonicHeading mt-5">
                    50% MINT - UTILITY ROLLING
                  </h4>
                  <p className="cartonicParaOne mt-4 mb-0 font3">
                    Got an Astrobaby with only common features? Don't worry! You
                    can increase the rarity of your Astrobaby by making a wish
                    to our magic crystal ball (under construction).You can burn
                    your current NFT with the item you receive from the crystal
                    ball, and potentially get a more rare Astrobaby.
                  </p>
                  <p className="cartonicParaOne font3">
                    Details & rules are to be announced after the minting date.
                  </p>
                </div>
              </div>
            </div>


            <div className="col-md-8">
              
              <div className="faqsection">
                <h2 className="cartonicHeading mt5" id="faq">F.A.Q.</h2>

                <div
                  className="faqData pointer mt-4"
                  data-bs-toggle="collapse"
                  data-bs-target="#question1"
                  aria-expanded="false"
                  aria-controls="question1"
                >
                  <div className="d-flex justify-content-between align-items-center relative">
                    <div className="question">
                      <h5 className="cartonicHeading m-0">MINT PRICE?</h5>
                      <i
                      className="fa-solid fa-angle-down angle"
                      data-bs-toggle="collapse"
                      data-bs-target="#question5"
                      aria-expanded="false"
                      aria-controls="question5"
                    ></i>
                    </div>
                    
                  </div>

                  <div class="collapse" id="question1">
                    <div class="answer">
                      <p class="cartonicParaOne font3">
                        <strong>Astrolist</strong>: free mint + gas
                        <br />
                        Availability: 2,500 Astrolist spots for 1,110 NFTs
                        <br />
                        <br />
                        <strong>Public mint</strong>: 0.02 ETH + gas
                        <br />
                        Availability: 7,770
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="faqData pointer mt-4"
                  data-bs-toggle="collapse"
                  data-bs-target="#question2"
                  aria-expanded="false"
                  aria-controls="question2"
                >
                  <div className="d-flex justify-content-between align-items-center relative">
                    <div className="question">
                      <h5 className="cartonicHeading m-0">WHEN IS THE MINT?</h5>
                      <i
                      className="fa-solid fa-angle-down angle"
                      data-bs-toggle="collapse"
                      data-bs-target="#question5"
                      aria-expanded="false"
                      aria-controls="question5"
                    ></i>
                    </div>
                    
                  </div>

                  <div class="collapse" id="question2">
                    <div class="answer">
                      <p class="cartonicParaOne font3">
                        <strong>Astrolist mint</strong>
                        <br />
                        Time: Tue, 16 Aug 2022 3:30 PM (GMT 0)
                        <br />
                        Duration: 60 minutes
                        <br />‍<br />
                        <strong>Public mint</strong>
                        <br />
                        Time: Tue, 16 Aug 2022 5 PM (GMT 0)
                        <br />
                        Duration: until sold out
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="faqData pointer mt-4"
                  data-bs-toggle="collapse"
                  data-bs-target="#question3"
                  aria-expanded="false"
                  aria-controls="question3"
                >
                  <div className="d-flex justify-content-between align-items-center relative">
                    <div className="question">
                      <h5 className="cartonicHeading m-0">WHEN IS THE REVEAL?</h5>
                      <i
                      className="fa-solid fa-angle-down angle"
                      data-bs-toggle="collapse"
                      data-bs-target="#question5"
                      aria-expanded="false"
                      aria-controls="question5"
                    ></i>
                    </div>
                    
                  </div>

                  <div class="collapse" id="question3">
                    <div class="answer">
                      <p class="cartonicParaOne font3">
                        Fri, 19 Aug 2022 4:30 PM (GMT 0)
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="faqData pointer mt-4"
                  data-bs-toggle="collapse"
                  data-bs-target="#question4"
                  aria-expanded="false"
                  aria-controls="question4"
                >
                  <div className="d-flex justify-content-between align-items-center relative">
                    <div className="question">
                      <h5 className="cartonicHeading m-0">
                        WHAT'S THE MAXIMUM MINT PER WALLET?
                      </h5>
                      <i
                      className="fa-solid fa-angle-down angle"
                      data-bs-toggle="collapse"
                      data-bs-target="#question5"
                      aria-expanded="false"
                      aria-controls="question5"
                    ></i>
                    </div>
                    <div className="button">
                      <i class="fa-solid fa-angle-down angle"></i>
                    </div>
                  </div>

                  <div class="collapse" id="question4">
                    <div class="answer">
                      <p class="cartonicParaOne font3">
                        <strong>Astrolist mint</strong>: Max 1 per wallet
                        <br />
                        <strong>Public mint</strong>: Max 10 per wallet
                      </p>
                    </div>
                  </div>
                </div>

                <div className="faqData pointer mt-4">
                  <div className="question relative">
                    <h5 className="cartonicHeading m-0 d-flex justify-content-between align-items-center ">
                      HOW DO I GET ON ASTROLIST / ALLOWLIST?
                    </h5>
                    <i
                      className="fa-solid fa-angle-down angle"
                      data-bs-toggle="collapse"
                      data-bs-target="#question5"
                      aria-expanded="false"
                      aria-controls="question5"
                    ></i>
                  </div>

                  <div class="collapse" id="question5">
                    <div class="answer">
                      <p class="cartonicParaOne font3 relative">
                        Fill in your Astrolist application
                        <a
                          href="https://app.heymint.xyz/astrolist"
                          className="appLink"
                        >
                          
                          here.
                        </a>
                      </p>
                      <p class="cartonicParaOne font3">
                        1. Participate in Twitter daily trivia
                        <br />
                        2. Participate in Twitter giveaways
                        <br />
                        3. Stay active and reach level 3 in Discord
                        <br />
                        4. Participate in Discord games &amp; trivia
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="faqData pointer mt-4"
                  data-bs-toggle="collapse"
                  data-bs-target="#question6"
                  aria-expanded="false"
                  aria-controls="question6"
                >
                  <div className="d-flex justify-content-between align-items-center relative">
                    <div className="question">
                      <h5 className="cartonicHeading m-0">
                        WHERE CAN I BUY AN ASTROBABY?
                      </h5>
                      <i
                      className="fa-solid fa-angle-down angle"
                      data-bs-toggle="collapse"
                      data-bs-target="#question5"
                      aria-expanded="false"
                      aria-controls="question5"
                    ></i>
                    </div>
                    <div className="button">
                      <i class="fa-solid fa-angle-down angle"></i>
                    </div>
                  </div>

                  <div class="collapse" id="question6">
                    <div class="answer">
                      <p class="cartonicParaOne font3">
                        For the initial launch, you can mint Astrobabies here on
                        this website. After that, you will be able to purchase
                        Astrobabies on secondary markets like OpenSea.io.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="faqData pointer mt-4"
                  data-bs-toggle="collapse"
                  data-bs-target="#question7"
                  aria-expanded="false"
                  aria-controls="question7"
                >
                  <div className="d-flex justify-content-between align-items-center relative">
                    <div className="question">
                      <h5 className="cartonicHeading m-0">
                        WHAT'S THE BENEFIT FOR HOLDING AN ASTROBABY?
                      </h5>
                      <i
                      className="fa-solid fa-angle-down angle"
                      data-bs-toggle="collapse"
                      data-bs-target="#question5"
                      aria-expanded="false"
                      aria-controls="question5"
                    ></i>
                    </div>
                    <div className="button">
                      <i class="fa-solid fa-angle-down angle"></i>
                    </div>
                  </div>

                  <div class="collapse" id="question7">
                    <div class="answer">
                      <p class="cartonicParaOne font3">
                        Your astrobaby is your pass to acquire premium astrology
                        and wellness content & products, as well as first-hand
                        access to hot upcoming NFT projects. Plus, who doesn't
                        like an adorable astrobaby?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <a href="https://discord.com/invite/DgyM3WyW6w">
          <img
            src={require("./assets/images/gifOne.gif")}
            className="staticImg"
            alt=""
          />
        </a>
      </section>
      <section className="cartoons">
        <div className="container px-md-5">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h2 className="cartonicHeading text-center bold">CREATORS</h2>
            </div>

            <div className="col-md-10 mx-auto">
              <div className="row">
                <div className="col-md-3 mt-2">
                  <img
                    src={require("./assets/images/bottom1.png")}
                    className="img-fluid"
                    alt=""
                  />
                  <h6 className="text-center mt-2 mb-1 headingOne">
                    PROJECT MANAGER
                  </h6>
                  <h4 className="text-center headingOne">OxRomy</h4>
                </div>
                <div className="col-md-3 mt-2">
                  <img
                    src={require("./assets/images/bottom2.gif")}
                    className="img-fluid"
                    alt=""
                  />

                  <h6 className="text-center mt-2 mb-1 headingOne">DIRECTOR</h6>
                  <h4 className="text-center headingOne">OxFeyfey</h4>
                </div>
                <div className="col-md-3 mt-2">
                  <img
                    src={require("./assets/images/bottom3.jpeg")}
                    className="img-fluid"
                    alt=""
                  />

                  <h6 className="text-center mt-2 mb-1 headingOne">
                    {" "}
                    TECH DEVELOPER{" "}
                  </h6>
                  <h4 className="text-center headingOne">Alaxy019</h4>
                </div>
                <div className="col-md-3 mt-2">
                  <img
                    src={require("./assets/images/bottom4.png")}
                    className="img-fluid"
                    alt=""
                  />

                  <h6 className="text-center mt-2 mb-1 headingOne">
                    ASTROLOGY GURU
                  </h6>
                  <h4 className="text-center headingOne"> Cynthia</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 ">
              <h2 className="cartonicHeading mt-5 bold text-center">AS SEEN ON</h2>
            </div>

            <div className="col-md-8 mt-4 mx-auto ">
              <div className="row bottom">
                <div className="col-md-3 mt-2 d-flex justify-content-center align-items-center">
                  <a href="https://nftevening.com/event/astrobaby-public-sale/">
                    {" "}
                    <img
                      src={require("./assets/images/product1.png")}
                      className="img-fluid"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-md-3 mt-2 d-flex justify-content-center align-items-center">
                  <a href="#">
                    <img
                      src={require("./assets/images/xyz.png").default}
                      className="img-fluid"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-md-3 mt-2 d-flex justify-content-center align-items-center">
                  <a href="https://nftcalendar.io/event/astrobaby/">
                    <img
                      src={require("./assets/images/product3.svg").default}
                      className="img-fluid"
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-md-3 mt-2 d-flex justify-content-center align-items-center">
                  <a href="https://www.nftdropscalendar.com/nft-drops/astrobaby">
                    <img
                      src={require("./assets/images/product4.png")}
                      className="img-fluid"
                      alt=""
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12 d-flex flex-column align-items-center">
              <img
                src={require("./assets/images/logo.png")}
                className="myLogo"
                alt=""
              />

              <div className="footerIcons">
                <a href="https://twitter.com/AstrobabyNFT">
                  <i class="fa-brands fa-twitter navTwitter"></i>
                </a>

                <a href="https://discord.com/invite/DgyM3WyW6w">
                  <i class="fa-brands fa-discord navTwitter"></i>
                </a>
              </div>

              <img
                src={require("./assets/images/footer.png")}
                className="mt-3"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default App;

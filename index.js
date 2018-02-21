(function( $ ) {
    $.Shop = function( element ) {
        this.$element = $( element );
        this.init();
    };

    $.Shop.prototype = {
        init: function() {


            this.cartPrefix = "winery-";
            this.cartName = this.cartPrefix + "cart";
            this.total = this.cartPrefix + "total";
            this.storage = sessionStorage;


            this.$formAddToCart = this.$element.find( "form.add-to-cart" );
            this.$formCart = this.$element.find( "#shopping-cart" );
            this.$checkoutCart = this.$element.find( "#checkout-cart" );
            this.$checkoutOrderForm = this.$element.find( "#checkout-order-form" );
            this.$subTotal = this.$element.find( "#stotal" );
            this.$shoppingCartActions = this.$element.find( "#shopping-cart-actions" );
            this.$updateCartBtn = this.$shoppingCartActions.find( "#update-cart" );
            this.$emptyCartBtn = this.$shoppingCartActions.find( "#empty-cart" );
            this.currency = "&euro;";



            // Validerings parametrar!
            this.requiredFields = {
                expression: {
                    value: /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]){2,4}$/
                },

                str: {
                    value: ""
                }

            };

            // Metoder

            this.createCart();
            this.handleAddToCartForm();
            this.handleCheckoutOrderForm();
            this.emptyCart();
            this.updateCart();
            this.displayCart();
            this.deleteProduct();



        },





        createCart: function() {
            if( this.storage.getItem( this.cartName ) === null ) {

                let cart = {};
                cart.items = [];

                this.storage.setItem( this.cartName, this._toJSONString( cart ) );
                this.storage.setItem( this.total, "0" );
            }
        },







        deleteProduct: function() {
            let self = this;
            if( self.$formCart.length ) {
                let cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
                let items = cart.items;

                $( document ).on( "click", ".pdelete a", function( e ) {
                    e.preventDefault();
                    let productName = $( this ).data( "product" );
                    let newItems = [];
                    for( let i = 0; i < items.length; ++i ) {
                        let item = items[i];
                        let product = item.product;
                        if( product === productName ) {
                            items.splice( i, 1 );
                        }
                    }
                    newItems = items;
                    let updatedCart = {};
                    updatedCart.items = newItems;

                    let updatedTotal = 0;
                    let totalQty = 0;
                    if( newItems.length === 0 ) {
                        updatedTotal = 0;
                        totalQty = 0;
                    } else {
                        for( let j = 0; j < newItems.length; ++j ) {
                            let prod = newItems[j];
                            let sub = prod.price * prod.qty;
                            updatedTotal += sub;
                            totalQty += prod.qty;
                        }
                    }

                    self.storage.setItem( self.total, self._convertNumber( updatedTotal ) );
                    self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );
                    $( this ).parents( "tr" ).remove();
                    self.$subTotal[0].innerHTML = self.currency + " " + self.storage.getItem( self.total );
                });
            }
        },

        // Visar shoppingcarten

        displayCart: function() {
            if( this.$formCart.length ) {
                let cart = this._toJSONObject( this.storage.getItem( this.cartName ) );
                let items = cart.items;
                let $tableCart = this.$formCart.find( ".shopping-cart" );
                let $tableCartBody = $tableCart.find( "tbody" );

                if( items.length === 0 ) {
                    $tableCartBody.html( "" );
                } else {


                    for( let i = 0; i < items.length; ++i ) {
                        let item = items[i];
                        let product = item.product;
                        let price = this.currency + " " + item.price;
                        let qty = item.qty;
                        let html = "<tr><td class='pname'>" + product + "</td>" + "<td class='pqty'><input type='text' value='" + qty + "' class='qty'/></td>";
                        html += "<td class='pprice'>" + price + "</td><td class='pdelete'><a href='' data-product='" + product + "'>&times;</a></td></tr>";

                        $tableCartBody.html( $tableCartBody.html() + html );
                    }

                }

                if( items.length === 0 ) {
                    this.$subTotal[0].innerHTML = this.currency + " " + 0.00;
                } else {

                    let total = this.storage.getItem( this.total );
                    this.$subTotal[0].innerHTML = this.currency + " " + total;
                }
            } else if( this.$checkoutCart.length ) {
                let checkoutCart = this._toJSONObject( this.storage.getItem( this.cartName ) );
                let cartItems = checkoutCart.items;
                let $cartBody = this.$checkoutCart.find( "tbody" );

                if( cartItems.length > 0 ) {

                    for( let j = 0; j < cartItems.length; ++j ) {
                        let cartItem = cartItems[j];
                        let cartProduct = cartItem.product;
                        let cartPrice = this.currency + " " + cartItem.price;
                        let cartQty = cartItem.qty;
                        let cartHTML = "<tr><td class='pname'>" + cartProduct + "</td>" + "<td class='pqty'>"  + cartQty + "</td>" + "<td class='pprice'>" + cartPrice + "</td></tr>";

                        $cartBody.html( $cartBody.html() + cartHTML );
                    }
                } else {
                    $cartBody.html( "" );
                }
                     //adderar eller subtraherar från checkout cart

                            //Html
                    /*<button class="plus-btn" type="button" name="button">
                    <img src="plus.svg" alt="" />
                    </button>
                    <input type="text" name="name" value="1">
                    <button class="minus-btn" type="button" name="button">
                    <img src="minus.svg" alt="" />
                    </button>*/

                /*$('.minus-btn').on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $input = $this.closest('div').find('input');
                    var value = parseInt($input.val());

                    if (value &amp;gt; 1) {
                        value = value - 1;
                    } else {
                        value = 0;
                    }

                    $input.val(value);

                });

                $('.plus-btn').on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var $input = $this.closest('div').find('input');
                    var value = parseInt($input.val());

                    if (value &amp;lt; 100) {
                        value = value + 1;
                    } else {
                        value =100;
                    }

                    $input.val(value);
                });*/


                if( cartItems.length > 0 ) {

                    let cartTotal = this.storage.getItem( this.total );
                    let subTot = this._convertString( cartTotal ) + this._convertString();

                    this.$subTotal[0].innerHTML = this.currency + " " + this._convertNumber( subTot );
                } else {
                    this.$subTotal[0].innerHTML = this.currency + " " + 0.00;

                }

            }
        },

        // Tömmer shoppingcarten


        emptyCart: function() {
            let self = this;
            if( self.$emptyCartBtn.length ) {
                self.$emptyCartBtn.on( "click", function() {
                    self._emptyCart();
                });
            }
        },

        // Uppdaterar shoppingcart

        updateCart: function() {
            let self = this;
            if( self.$updateCartBtn.length ) {
                self.$updateCartBtn.on( "click", function() {
                    let $rows = self.$formCart.find( "tbody tr" );
                    let updatedTotal = 0;
                    let totalQty = 0;
                    let updatedCart = {};
                    updatedCart.items = [];

                    $rows.each(function() {
                        let $row = $( this );
                        let pname = $.trim( $row.find( ".pname" ).text() );
                        let pqty = self._convertString( $row.find( ".pqty > .qty" ).val() );
                        let pprice = self._convertString( self._extractPrice( $row.find( ".pprice" ) ) );

                        let cartObj = {
                            product: pname,
                            price: pprice,
                            qty: pqty
                        };

                        updatedCart.items.push( cartObj );


                    });

                    self.storage.setItem( self.total, self._convertNumber( updatedTotal ) );
                    self.storage.setItem( self.cartName, self._toJSONString( updatedCart ) );

                });
            }
        },

        //Adderar till shoppingcarten

        handleAddToCartForm: function() {
            let self = this;
            self.$formAddToCart.each(function() {
                let $form = $( this );
                let $product = $form.parent();
                let price = self._convertString( $product.data( "price" ) );
                let name =  $product.data( "name" );

                $form.on( "submit", function() {
                    let qty = self._convertString( $form.find( ".qty" ).val() );
                    let subTotal = qty * price;
                    let total = self._convertString( self.storage.getItem( self.total ) );
                    let sTotal = total + subTotal;
                    self.storage.setItem( self.total, sTotal );
                    self._addToCart({
                        product: name,
                        price: price,
                        qty: qty
                    });

                });
            });
        },



        handleCheckoutOrderForm: function() {
            let self = this;
            if( self.$checkoutOrderForm.length ) {
                let $sameAsBilling = $( "#same-as-billing" );
                $sameAsBilling.on( "change", function() {
                    let $check = $( this );
                    if( $check.prop( "checked" ) ) {
                        $( "#fieldset-shipping" ).slideUp( "normal" );
                    } else {
                        $( "#fieldset-shipping" ).slideDown( "normal" );
                    }
                });

                self.$checkoutOrderForm.on( "submit", function() {
                    let $form = $( this );
                    let valid = self._validateForm( $form );

                    if( !valid ) {
                        return valid;
                    } else {
                        self._saveFormData( $form );
                    }
                });
            }
        },



        _emptyCart: function() {
            this.storage.clear();
        },










        _convertString: function( numStr ) {
            let num;
            if( /^[-+]?[0-9]+\.[0-9]+$/.test( numStr ) ) {
                num = parseFloat( numStr );
            } else if( /^\d+$/.test( numStr ) ) {
                num = parseInt( numStr, 10 );
            } else {
                num = Number( numStr );
            }

            if( !isNaN( num ) ) {
                return num;
            } else {
                console.warn( numStr + " cannot be converted into a number" );
                return false;
            }
        },

        //Konverterar nummer till sträng

        _convertNumber: function( n ) {
            let str = n.toString();
            return str;
        },

        //Json till javascript

        _toJSONObject: function( str ) {
            let obj = JSON.parse( str );
            return obj;
        },

        //Det motsatta


        _toJSONString: function( obj ) {
            let str = JSON.stringify( obj );
            return str;
        },


        //Lägger till shoppingcarten som Json


        _addToCart: function( values ) {
            let cart = this.storage.getItem( this.cartName );

            let cartObject = this._toJSONObject( cart );
            let cartCopy = cartObject;
            let items = cartCopy.items;
            items.push( values );

            this.storage.setItem( this.cartName, this._toJSONString( cartCopy ) );
        },





        //Kollar valideringen (requiredFields)

        _validateForm: function( form ) {
            let self = this;
            let fields = self.requiredFields;
            let $visibleSet = form.find( "fieldset:visible" );
            let valid = true;

            form.find( ".message" ).remove();

            $visibleSet.each(function() {

                $( this ).find( ":input" ).each(function() {
                    let $input = $( this );
                    let type = $input.data( "type" );
                    let msg = $input.data( "message" );

                    if( type === "string" ) {
                        if( $input.val() === fields.str.value ) {
                            $( "<span class='message'/>" ).text( msg ).
                            insertBefore( $input );

                            valid = false;
                        }
                    } else {
                        if( !fields.expression.value.test( $input.val() ) ) {
                            $( "<span class='message'/>" ).text( msg ).
                            insertBefore( $input );

                            valid = false;
                        }
                    }

                });
            });

            return valid;

        },


    };

    $(function() {
        let shop = new $.Shop( "#site" );
    });

})( jQuery );
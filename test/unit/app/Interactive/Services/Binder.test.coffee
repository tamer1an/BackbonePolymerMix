describe "Service Interactive // Service Binder", ->

  beforeEach module "Interactive"

  beforeEach ->
    @stub =
      a: (a,b,c) ->
        s = jasmine.createSpy('stub.a')
        s(a,b,c)
        s
      b: (a,b,c) ->
        s = jasmine.createSpy('stub.b')
        s(a,b,c)
        s
      c: (a,b,c) ->
        s = jasmine.createSpy('stub.c')
        s(a,b,c)
        s

  it "binds all arg", inject ( Binder ) ->
    curried = Binder @stub, 10

    expect curried.a(20,30)
      .toHaveBeenCalledWith 10,20,30

    expect curried.b(20,30)
          .toHaveBeenCalledWith 10,20,30

    expect curried.c(20,30)
          .toHaveBeenCalledWith 10,20,30


    curried = Binder curried, 20

    expect curried.a(30)
    .toHaveBeenCalledWith 10,20,30

    expect curried.b(30)
    .toHaveBeenCalledWith 10,20,30

    expect curried.c(30)
    .toHaveBeenCalledWith 10,20,30


  it "binds args to selected methods" , inject (Binder) ->
    curried = Binder @stub, 10, ['a','b']

    expect curried.a(20,30)
      .toHaveBeenCalledWith 10,20,30

    expect curried.b(20,30)
          .toHaveBeenCalledWith 10,20,30

    expect curried.c
          .not.toBeDefined()


